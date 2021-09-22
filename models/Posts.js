const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        creator: {
            type: String,
            required: true,
            trim: true
        },
        voteSum: {
            type: Number,
            required: true
        },
        userVoters: {
            type: Map,
            of: Number
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);