import mongoose from "mongoose";

const bipSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    categories: [{
        type: String,
        default: 'General'
    }],
    likes: {
        type: Number,
        default: 0
    },
    picture:{
        type: String
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
}, {
    timestamps: true
});

export default mongoose.model('Bip', bipSchema);