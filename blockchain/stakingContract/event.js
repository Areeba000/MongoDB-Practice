const ethers = require('ethers');
require('dotenv').config();
const mongoose=require(`mongoose`);
const dbURI="mongodb+srv://areeba1234:areeba1234@cluster0.cmss8dd.mongodb.net/"
mongoose.connect(dbURI)
.then(() => console.log('Connected to MongoDB'))
.catch(error => console.error('Error connecting to MongoDB:', error));
const Blog=require(`./models/blog`);
// Connect to an Ethereum node
const provider = new ethers.providers.JsonRpcProvider('https://polygon-mumbai-pokt.nodies.app');

// Specify the contract address and ABI (Application Binary Interface)
const contractAddress = '0xc1a2a6459C041bDE6B896a0054AF1dc3b44D3d59';
const contractAbi = require('./contracts/staking.json'); // Your contract ABI here

// Create a contract instance
const contract = new ethers.Contract(contractAddress, contractAbi, provider);

// Specify the event name and any additional filters
const eventName = 'tokensStaked';

// Specify the block range for which you want to retrieve events
const startBlock = 44098457; // Replace with the start block number
const endBlock = 44103428; // Replace with the end block number or 'latest'

// Get past events
async function getPastEvents() {
  try {
    const events = await contract.queryFilter(eventName, startBlock, endBlock);
    for (let index = 0; index < events.length; index++) {
        const event = events[index];
        const blog = new Blog({
            amountStaked:event.amountStaked,
            transactionHash:event.transactionHash,
            blockNumber:event.blockNumber,
            stakerAddress:event.stakerAddress
          });
         }

    console.log('Past events:', events);
  } catch (error) {
    console.error('Error getting past events:', error);
  }
}

getPastEvents();
