import mysql from "mysql2";

const pool = mysql.createPool({
    host: 'localhost', // or 127.0.0.1
    user: 'orgadmin',
    password: 'useruser',
    database: 'orgdb',
}).promise();

// org functions

export async function getOrgs() {
    const [result] = await pool.query("SELECT * FROM org");
    return result;
}

export async function addOrg(org_name, classification) {
    await pool.query(
        `INSERT INTO org (org_name, classification)
        VALUES (?, ?)`
        , [org_name, classification]
    );
}

export async function updateOrg(newName, newClassification, org_id) {
    await pool.query(
        `UPDATE org
        SET org_name = ?, classification = ?
        WHERE org_id = ?`
        , [newName, newClassification, org_id]
    );
}

export async function deleteOrg(org_id) {
    await pool.query(
        `DELETE org
        WHERE org_id = ?`
        , [org_id]
    );
}

// member functions

export async function getMembersByOrg() {
    const [result] = await pool.query(
        `SELECT o.org_name, CONCAT(s.fname, ' ', s.lname) AS student_name, om.position, om.status, s.gender, s.degprog, om.join_date, om.committee
        FROM student AS s JOIN org_mem AS om ON s.student_id = om.student_id
        JOIN org AS o ON om.org_id = o.org_id ORDER BY o.org_id;`
    );
    return result;
}

export async function getMembersByOrgName(orgName) {
    const [result] = await pool.query(
        `SELECT o.org_name, om.position, om.status, s.gender, s.degprog, om.join_date, om.committee
         FROM student AS s 
         JOIN org_mem AS om ON s.student_id = om.student_id
         JOIN org AS o ON om.org_id = o.org_id
         WHERE o.org_name = ?
         ORDER BY o.org_id`,
        [orgName]
    );
    return result;
}

export async function addMember(member) {
    const {
        org_name,
        student_id,
        position,
        status,
        gender,
        degprog,
        join_date,
        committee,
    } = member;

    const [org] = await pool.query(`SELECT org_id FROM org WHERE org_name = ?`, [org_name]);
    if (org.length === 0) throw new Error("Organization not found");

    const org_id = org[0].org_id;

    await pool.query(`
        INSERT INTO student (student_id, gender, degprog)
        VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE gender = VALUES(gender), degprog = VALUES(degprog)
    `, [student_id, gender, degprog]);

    await pool.query(`
        INSERT INTO org_mem (student_id, org_id, position, status, join_date, committee)
        VALUES (?, ?, ?, ?, ?, ?)
    `, [student_id, org_id, position, status, join_date, committee]);
}


// TODO: addMember, editMember, deleteMember

// fee functions

export async function getPendingFees() {

}

// extra functions

export async function getFields() {

}

export default {
    getOrgs,
    addOrg,
    updateOrg,
    deleteOrg,
    getMembersByOrg,
    getMembersByOrgName,
};
