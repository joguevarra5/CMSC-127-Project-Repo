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

// member functions

export async function getMembersByOrg() {
    const [result] = await pool.query(
        `SELECT o.org_name, om.org_id, CONCAT(s.fname, ' ', s.lname) AS student_name, om.position, om.status,
        s.student_id, s.gender, s.degprog, YEAR(om.join_date) AS batch, om.join_date, om.committee
        FROM student AS s JOIN org_mem AS om ON s.student_id = om.student_id
        JOIN org AS o ON om.org_id = o.org_id ORDER BY o.org_id;`
    );
    return result;
}

export async function getMembersByOrgName(orgName) {
    const [result] = await pool.query(
        `SELECT o.org_name, om.org_id, CONCAT(s.fname, ' ', s.lname) AS student_name, om.position, om.status,
        s.student_id, s.gender, s.degprog, YEAR(om.join_date) AS batch, om.join_date, om.committee
        FROM student AS s 
        JOIN org_mem AS om ON s.student_id = om.student_id
        JOIN org AS o ON om.org_id = o.org_id
        WHERE o.org_name = ?
        ORDER BY o.org_id`,
        [orgName]
    );
    return result;
}

export async function editMember(position, assignment_date, org_id, student_id) {
    const [result] = await pool.query(
        `UPDATE org_mem
         SET position = ?, assignment_date = ?
         WHERE org_id = ? AND student_id = ?`,
        [position, assignment_date, org_id, student_id]
    );
    console.log("Update result:", result); // 🪵

    if (result.affectedRows === 0) {
        console.warn("No rows were updated. Check org_id and student_id.");
    }
    return result;
}

export async function deleteMember(org_id, student_id) {
    await pool.query(
        `DELETE FROM org_mem
        WHERE org_id = ? AND student_id = ?`
        , [org_id, student_id]
    );
}

export async function addMember(org_id, student_id, join_date, status, position, assignment_date, committee) {
    try {
        const [result] = await pool.query(
            `INSERT INTO org_mem (org_id, student_id, join_date, status, position, assignment_date, committee)
            VALUES (?, ?, ?, ?, ?, ?, ?);`,
            [org_id, student_id, join_date, status, position, assignment_date, committee]
        );
        return result;
    } catch (error) {
        console.error("Failed to add member:", error);
        throw error;
    }
}

// fee functions

// student functions

export default {
    getOrgs,
    addOrg,
    getMembersByOrg,
    getMembersByOrgName,
    editMember,
    deleteMember,
    addMember
};
