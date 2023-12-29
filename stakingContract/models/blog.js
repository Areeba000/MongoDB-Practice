const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
  hash: {
    type: String,
    required: true,
    unique: true,
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  nonce: {
    type: Number,
    required: true,
  },
  gasLimit: {
    type: Number,
    required: true,
  },
  gasPrice: {
    type: Number,
  },
  maxPriorityFeePerGas: {
    type: Number,
  },
  maxFeePerGas: {
    type: Number,
  },
  data: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  chainId: {
    type: Number,
    required: true,
  },
  signature: {
    r: String,
    s: String,
    yParity: Number,
    networkV: Number,
  },
  accessList: {
    type: Array,
  },
}, { timestamps: true });

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;
