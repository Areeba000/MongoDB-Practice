const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const blogSchema = new Schema({
    transactionHash: {
        type: String,
      },
      Address: {
        type: String,
      },
      amount:{
        type:String,
      },
      blockNumber: {
            type: Number,
      },

});
 const Blog2 = mongoose.model('Blog', blogSchema);

module.exports = Blog2;