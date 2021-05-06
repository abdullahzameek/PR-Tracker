const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const PullReq = new Schema(
    {
        prId: {type: Number, required: true, unique: true},
        prTitle: {type: String, required: true},
        prCreatedAt : {type: Date, required: true},
        repositoryId : {type: Number, required: true},
        prSize : {type: Number},
        prClosedAt : {type: Date},
        prMergedAt : {type: Date},
        prMerged : {type: Boolean},
        prAdditions : {type: Number},
        prDeletions : {type: Number}
    },
    {
        collection: 'PullReq'
    }
);
module.exports = mongoose.model('pr', PullReq); 
