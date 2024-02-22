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
const  abi = require('./contracts/erc20.json');
const contract = new ethers.Contract(contractADDRESS, abi, signer);

const express = require('express');
const app = express();
app.use(express.json());


async function mongoConnection(){
await client.connect()
}
app.post('/addBook', async (req, res) => {
    const { title, author } = req.body;

    try {
        const transaction = await contract.addBook(title, author);
        const db=client.db("new");
        const collection=db.collection("collection4");
         await collection.insertOne(transaction);
        res.status(200).json({ transactionHash: transaction.hash });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.post('/borrowBook', async (req, res) => {
    const { bookId, daysToBorrow } = req.body;

    try {
        const transaction = await contract.borrowBook(bookId, daysToBorrow, {
            value: 1 * 10^18
        });
        const db=client.db("new");
        const collection=db.collection("collection4");
        await collection.insertOne(transaction);

        res.status(200).json({ transactionHash: transaction.hash });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
   
    }
});
app.post('/returnBook', async (req, res) => {
    const { bookId } = req.body;

    try {
        const transaction = await contract.returnBook(bookId);
        
        const db=client.db("new");
        const collection=db.collection("collection4");
         await collection.insertOne(transaction);
        res.status(200).json({ transactionHash: transaction.hash });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.post('/withdraw',  async (req, res) => {
    try {
        const transaction = await contract.withdraw();
        
        res.status(200).json({ transactionHash: transaction.hash });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

mongoConnection()