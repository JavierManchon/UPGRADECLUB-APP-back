import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    content: {type: String, required: true},
    date: {type: Date, default: Date.now},
    //Los comentarios deben ir asociados a un bip, ver como los asocio a un usuario para se sepa quien los envía
    bip: {type: mongoose.Schema.Types.ObjectId, ref: 'Bip', required: true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User',required: true
    }
}, {
    timestamps: true
});

export default mongoose.model('Comment', commentSchema);