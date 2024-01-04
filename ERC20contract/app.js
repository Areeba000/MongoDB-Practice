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

app.post('/mint', async (req, res) => {
    const { account, amount } = req.body;

    try {
        const transaction = await contract.mint(account, amount);
        const db=client.db("new");
        const collection=db.collection("collection3");
       const result= await collection.insertOne(transaction);
        console.log(transaction)
        res.json({ success: true, transactionHash: transaction.transactionHash });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});
app.post('/burn', async (req, res) => {
    const { account, amount } = req.body;

    try {
        const transaction = await contract.burn(account, amount)
       const db=client.db("new");
       const collection=db.collection("collection3");
       await collection.insertOne(transaction);

        res.json({ success: true, transactionHash: transaction.transactionHash });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});
app.post('/getbalance', async (req, res) => {
    const { ownerAddress } = req.body;

    try {
        const transaction = await contract.balanceOf(ownerAddress);
         const balanceString = transaction.toString();
         res.json({ success: true, balance: balanceString });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});
app.post('/transfer', async (req, res) => {
    const { recipient, amount } = req.body;

    try {
      
        const result = await contract.transfer(recipient, amount)
        const db=client.db("new");
        const collection=db.collection("collection3");
        await collection.insertOne(result); 
        res.json({ success: true, transactionHash: result.transactionHash });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});
app.post('/approve', async (req, res) => {
    const { spender, amount } = req.body;

    try {
        const result = await contract.approve(spender, amount);
        const db=client.db("new");
        const collection=db.collection("collection3");
        await collection.insertOne(result); 
        res.json({ success: true, transactionHash: result.transactionHash });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});
app.post('/allowance', async (req, res) => {
    const { owner, spender } = req.body;

    try {
        const allowance = await contract.allowancefun(owner, spender);
        const allowanceString = allowance.toString();

        res.json({ success: true, allowance: allowanceString });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});
app.post('/transferFrom', async (req, res) => {
    const { sender, recipient, amount } = req.body;
     console.log(req.body)
    try {
     
        const result = await contract.transferFrom(sender, recipient, amount);
        const db=client.db("new");
        const collection=db.collection("collection3");
        await collection.insertOne(result); 
        res.json({ success: true, transactionHash: result.transactionHash });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});
async function main(){
    const db=client.db("new");
    const collection=db.collection("collection3");
    const result = await collection.findOne({ nonce: 215});
    console.log(result);
}
const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
main();
mongoConnection()
  