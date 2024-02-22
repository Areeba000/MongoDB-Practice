const { ethers } = require('ethers');
require('dotenv').config();
const { MongoClient } = require("mongodb");

const dbURI="mongodb+srv://areeba1234:areeba1234@cluster0.cmss8dd.mongodb.net/"
const client = new MongoClient(dbURI)
const API_URL = process.env.API_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const contractADDRESS = process.env.CONTRACT_ADDRESS;

const provider = new ethers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com/');

const signer = new ethers.Wallet(PRIVATE_KEY, provider);

// Check if your ABI import path is correct
const  abi = require('./contracts/quiz.json');
const contract = new ethers.Contract(contractADDRESS, abi, signer);

const express = require('express');
const app = express();
app.use(express.json());


async function mongoConnection(){
await client.connect()
}
app.post('/teacherAdd', async (req, res) => {
    const { teacherAddress } = req.body;

    try {
        const transaction = await contract.teacherAdd(teacherAddress);
        const db=client.db("new");
        const collection=db.collection("QUIZ CONTRACT");
         await collection.insertOne(transaction);
        

        res.status(200).json({ transactionHash: transaction.hash });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.post('/teacherRemove', async (req, res) => {
    const { teacherAddress } = req.body;

    try {
        const transaction = await contract.teacherRemove(teacherAddress);
        const db=client.db("new");
        const collection=db.collection("QUIZ CONTRACT");
        await collection.insertOne(transaction);

        res.status(200).json({ transactionHash: transaction.hash });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.post('/addStudent', async (req, res) => {
    const { name, rollno, homeaddress, className } = req.body;

    try {
        const transaction = await contract.addStudent(name, rollno, homeaddress, className );
        const db=client.db("new");
        const collection=db.collection("QUIZ CONTRACT");
         await collection.insertOne(transaction);

        res.status(200).json({ transactionHash: transaction.hash });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.post('/createQuiz', async (req, res) => {
    const { quizName, question, hint } = req.body;

    try {
        const transaction = await contract.createQuiz(quizName, question, hint);
        const db=client.db("new");
        const collection=db.collection("QUIZ CONTRACT");
         await collection.insertOne(transaction);

        res.status(200).json({ transactionHash: transaction.hash });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.get('/getQuiz/:quizCount', async (req, res) => {
    const { quizCount } = req.params;

    try {
        const result = await contract.getQuiz(quizCount);
        res.status(200).json({ question: result[0], quizName: result[1] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.post('/takeQuiz', async (req, res) => {
    const { quizCount, answer } = req.body;

    try {
        const transaction = await contract.takeQuiz(quizCount, answer);
        const db=client.db("new");
        const collection=db.collection("QUIZ CONTRACT");
         await collection.insertOne(transaction);

        res.status(200).json({ transactionHash: transaction.hash });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


const port = 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

mongoConnection()