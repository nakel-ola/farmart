import { model, Schema } from "mongoose";

const inviteSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    level: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    inviteCode: {
        type: String,
        required: true
    },
}, { timestamps: true })

export default model("invites",inviteSchema);