const { ethers } = require('ethers');
require('dotenv').config();
const mongoose=require(`mongoose`);
const dbURI="mongodb+srv://areeba1234:areeba1234@cluster0.cmss8dd.mongodb.net/"
mongoose.connect(dbURI)
.then(() => console.log('Connected to MongoDB'))
.catch(error => console.error('Error connecting to MongoDB:', error));
const Blog1=require(`./stakingdata.js`);
const API_URL = process.env.API_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const contractADDRESS = process.env.CONTRACT_ADDRESS;

const provider = new ethers.providers.JsonRpcProvider(`https://rpc-mumbai.maticvigil.com/`);

const signer = new ethers.Wallet(PRIVATE_KEY, provider);

// Check if your ABI import path is correct
const  abi = require('./contracts/staking.json');
const contract1 = new ethers.Contract(contractADDRESS, abi, signer);


const express = require('express');
const app = express();
app.use(express.json());
const eventName = 'tokensStaked';

// Specify the block range for which you want to retrieve events
const startBlock = 44098457; // Replace with the start block number
const endBlock = 44103428; // Replace with the end block number or 'latest'
app.post('/stakeTokens', async (req, res) => {
    const { amount } = req.body;
    
    try {
      const transaction = await contract1.stakeTokens(amount);
      await transaction.wait();
      const blog = new Blog({
        hash: transaction.hash,
        from: transaction.from,
        chainId: parseInt(transaction.chainId),
        to:transaction.to,
        nonce:transaction.nonce,
        gasLimit: parseInt(transaction.gasLimit),
        gasPrice:transaction.gasPrice,
        maxPriorityFeePerGas:parseInt(transaction.maxPriorityFeePerGas),
        maxFeePerGas:parseInt(transaction.maxFeePerGas),
        data:parseInt(transaction.data),
        value:parseInt(transaction.value),
        signature:transaction.signature,
        accessList:transaction.accessList
      });
      
      blog.save(transaction);
      res.json({ transactionHash: transaction.hash, status: 'Success' });
      console.log(transaction);
    } catch (error) {
      res.status(500).json({ error: error.message, status: 'Failed' });
    }
  });
  app.get('/istokenstake', async (req, res) => {
    const { ownerAddress } = req.body;
  
    try {
      const isTokenStaked = await contract1.istokenstake(ownerAddress);
  
      res.json({ isTokenStaked, status: 'Success' });
    } catch (error) {
      res.status(500).json({ error: error.message, status: 'Failed' });
    }
  });
  app.post('/unstake', async (req, res) => {
     const {} = req.body;
    try {
      const transaction = await contract1.unstake();
      await transaction.wait();
      const blog = new Blog1({
        // amountStaked:transaction.amountStaked,
        transactionHash:transaction.hash,
        // blockNumber:transaction.blockNumber,
        stakerAddress:transaction.to
      });
      blog.save()
      console.log(transaction)
      res.json({ transactionHash: transaction.hash, status: 'Success' });
    } catch (error) {
      res.status(500).json({ error: error.message, status: 'Failed' });
    }
  });
  app.post('/api/getData/', async (req, res) => {
    try {
      const fromAddress = req.body.fromAddress;
      console.log(fromAddress)
  
      // Find all documents in the 'blogs' collection
      const blogs = await Blog1.findOne({ from: fromAddress });
  
      res.json({ data: blogs });
    } catch (error) {
      console.error('Error retrieving data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  
  // Call the function to retrieve data

  
  

  

  // app.get("/add-blog", async (req, res) => {
  //   const blog = new Blog({
  //     title: `new blog 2`,
  //     snippet:`about my new blog`,
  //     body:`more about my new blog`
  //   })
  //  blog.save(blog)
  //  .then((result)=>{
  //   res.send(result)     
  //  })
  //  .catch((err)=>{
  //    console.log(err);
  //  })
  // })
  // app.get(`/all-blogs`,(req,res)=>{
  //   Blog.find()
  //   .then((result)=>{
  //     res.send(result);
  //   })
  //   .catch((err)=>{
  //     console.log(err);
  //   });

  // })
  // app.get(`/single-blog`,(req,res)=>{
  //   Blog.findById(`658c0d3f9bfc3600cfd80da5`)
  //   .then((result)=>{
  //     res.send(result)
  //   })
  //   .catch((err)=>{
  //   console.log(err)
  //   })
  // })
  // app.get(`blogs`,(req,res)=>{
  //   Blog.find()
  //   .then((result)=>{

  //   })
  //   .catch((err)=>{
  //     console.log(err)
  //   })
  // })
// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});