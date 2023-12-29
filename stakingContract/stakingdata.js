const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const blogSchema = new Schema({
    // blockNumber: {
    //     type: Number,
    //     required: true,
    //   },
      transactionHash: {
        type: String,
        required: true,
      },
      // amountStaked: {
      //   type: Number,
      //   required: true,
      // },
      stakerAddress: {
        type: String,
        required: true,
      },
});
const Blog1 = mongoose.model('Blog', blogSchema);

module.exports = Blog1;