import express from "express";
import orgService, { getMembersByOrgNameSorted } from './index.js';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

// org endpoints

app.get("/orgs", async (req, res) => {
    const result = await orgService.getOrgs();
    const toObject = result.map(org => ({ org_id: org.org_id, org_name: org.org_name }));
    res.send(toObject);
});

app.post('/org-add', async (req, res) => {
    try {
        const { org_name, classification } = req.body;
        await orgService.addOrg(org_name, classification);
        res.status(201).send({ message: 'Org added.' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Failed to add org.' });
    }
});

app.get("/org-names", async (req, res) => {
    const result = await orgService.getOrgs();
    const namesOnly = result.map(org => ({
        org_id: org.org_id,
        org_name: org.org_name,
        classification: org.classification,
    }));
    res.send(namesOnly);
});


// member endpoints

app.get("/members", async (req, res) => {
    const result = await orgService.getMembersByOrg();
    console.log(result);
    res.send(result);
});

app.get("/members/by-org", async (req, res) => {
    const { org_name } = req.query;

    try {
        const result = org_name
            ? await orgService.getMembersByOrgName(org_name)
            : await orgService.getMembersByOrg();

        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Failed to fetch members." });
    }
});

app.get("/members-filter-by", async (req, res) => {
    const { role, status, gender, degprog, batch, committee, org_name } = req.query;

    let query = `
        SELECT o.org_name, om.org_id, CONCAT(s.fname, ' ', s.lname) AS student_name, 
               om.position AS role, om.status, s.student_id, s.gender, s.degprog, 
               YEAR(om.join_date) AS batch, om.join_date, om.committee
        FROM student AS s 
        JOIN org_mem AS om ON s.student_id = om.student_id
        JOIN org AS o ON om.org_id = o.org_id
        WHERE 1 = 1
    `;

    const params = [];

    if (org_name) {
        query += ` AND o.org_name = ?`;
        params.push(org_name);
    }
    if (role) {
        query += ` AND om.position = ?`;
        params.push(role);
    }
    if (status) {
        query += ` AND om.status = ?`;
        params.push(status);
    }
    if (gender) {
        query += ` AND s.gender = ?`;
        params.push(gender);
    }
    if (degprog) {
        query += ` AND s.degprog = ?`;
        params.push(degprog);
    }
    if (batch) {
        query += ` AND YEAR(om.join_date) = ?`;
        params.push(batch);
    }
    if (committee) {
        query += ` AND om.committee = ?`;
        params.push(committee);
    }

    query += ` ORDER BY o.org_id`;

    try {
        const [result] = await pool.query(query, params);
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Failed to fetch members." });
    }
});

app.put('/member-edit', async (req, res) => {
    try {
        const { position, assignment_date, org_id, student_id } = req.body;
        await orgService.editMember(position, assignment_date, org_id, student_id);
        res.status(200).send({ message: 'Edited member successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Failed to edit member.' });
    }
});

app.delete('/member-delete', async (req, res) => {
    try {
        const { org_id, student_id } = req.body;
        await orgService.deleteMember(org_id, student_id);
        res.status(200).send({ message: 'Deleted member successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Failed to delete member.' });
    }
});

app.post('/member-add', async (req, res) => {
    try {
        const { org_id, student_id, join_date, status, position, assignment_date, committee } = req.body;
        await orgService.addMember(org_id, student_id, join_date, status, position, assignment_date, committee);
        res.send(result).status(200);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Failed to add member.' });
    }
});

// reports

app.get('/member-executives', async (req, res) => {
    const { start, end } = req.query;

    try {
        const result = await orgService.getExecutiveMembers(start, end);
        res.status(200).send({ message: 'Fetched executive members successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Failed to fetch executive members.' });
    }
});

// fee endpoints
app.get("/fees", async (req, res) => {
    try {
        const result = await orgService.getAllFees(); // You'll need to implement this in orgService
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to fetch all fees." });
    }
});

app.get("/fees/by-org", async (req, res) => {
    const { org_name } = req.query;

    try {
        if (org_name) {
            const result = await orgService.getFeesByOrgName(org_name);
            res.send(result);
        } else {
            // Return all orgs and their fees
            const orgs = await orgService.getOrgs();
            const allFeesByOrg = {};

            for (const org of orgs) {
                const fees = await orgService.getFeesByOrgName(org.org_name);
                allFeesByOrg[org.org_name] = fees;
            }

            res.send(allFeesByOrg);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to fetch fees for organization(s)." });
    }
});

app.get("/fees/by-student", async (req, res) => {
    const { student_id } = req.query;

    try {
        const result = await orgService.getFeesByStudentId(student_id);
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to fetch fees for student." });
    }
});

app.post("/fee-add", async (req, res) => {
    try {
        const { transaction_id, deadline_date, payment_date, payment_status, amount, student_id, org_id } = req.body;
        await orgService.addFee(transaction_id, deadline_date, payment_date, payment_status, amount, student_id, org_id);
        res.status(201).send({ message: "Added fee successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to add fee." });
    }
});

app.put("/fee-edit", async (req, res) => {
    try {
        const { payment_date, payment_status, org_id, student_id } = req.body;
        await orgService.editFee(payment_date, payment_status, org_id, student_id);
        res.status(200).send({ message: "Edited fee successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to edit fee." });
    }
});

app.get("/fees-pending", async (req, res) => {
    try {
        const result = await orgService.getPendingFees();
        console.log('Pending fees result:', result);  
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to fetch pending fees." });
    }
});


// server

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(8080, () => {
    console.log("Server is running on port 8080");
})