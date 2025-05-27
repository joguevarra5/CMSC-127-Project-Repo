import express from "express";
import orgService from './index.js';
import cors from 'cors';

const app = express();
app.use(cors());

// endpoints

app.get("/orgs", async (req, res) => {
    const result = await orgService.getOrgs();
    res.send(result);
});

app.get("/org-names", async (req, res) => {
    const result = await orgService.getOrgs();
    const namesOnly = result.map(org => ({ org_name: org.org_name }));
    res.send(namesOnly);
});







// server

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(8080, () => {
    console.log("Server is running on port 8080");
})