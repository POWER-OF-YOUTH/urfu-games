import mongoose, { mongo, Schema } from 'mongoose';

const competenceSchema = new Schema(
    {
        id: {
            type: String,
            unique: true,
            required: true,
            index: true
        },
        name: {
            type: String,
            unique: true,
            required: true,
            index: true,
            lowercase: true
        },
        description: {
            type: String,
            default: ""
        }
    },
    { versionKey: false }
);

const Competence = mongoose.model("Competence", competenceSchema);

export default Competence;
