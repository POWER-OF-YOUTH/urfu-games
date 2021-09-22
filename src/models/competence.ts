import mongoose, { mongo, Schema } from 'mongoose';

interface ICompetence {
    id: string;
    name: string;
    description: string;
}

const competenceSchema = new Schema<ICompetence>(
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

const Competence = mongoose.model<ICompetence>("Competence", competenceSchema);

export default Competence;
