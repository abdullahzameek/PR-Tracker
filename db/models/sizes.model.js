const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const Sizes = new Schema(
    {
        repositoryId : {type: Number, required: true},
        size : {type : Number, required: true},
        prId : {type: Number, required:true}
    },
    {
        collection: 'Sizes'
    }
);

module.exports = mongoose.model('sizes', Sizes); 
