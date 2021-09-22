const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema(
    {
        content: {
            type: String,
            required: true,
            trim: true
        },
        post_id: {
            type: String,
            required: true,
            trim: true
        },
        creator: {
            type: String,
            required: true,
            trim: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Comment', commentSchema);