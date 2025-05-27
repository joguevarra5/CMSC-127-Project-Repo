import express from "express";
import orgService from './index.js';
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


// server

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(8080, () => {
    console.log("Server is running on port 8080");
})