import express from "express";
import { getOrgs } from './index.js';

const app = express();

// endpoints

app.get("/orgs", async (req, res) => {
    const result = await getOrgs();
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