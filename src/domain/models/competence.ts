import mongoose, { 
    Schema, 
    HydratedDocument, 
    Model
} from "mongoose";

interface ICompetence {
    id: string;
    name: string;
    description: string;
    createdAt: Date;
}

interface ICompetenceInstanceMethods { }

interface ICompetenceModel extends Model<ICompetence, any, ICompetenceInstanceMethods> { }

const competenceSchema = new Schema<ICompetence, ICompetenceModel>(
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
            index: true
        },
        description: {
            type: String,
            default: ""
        },
        createdAt: {
            type: Date
        }
    },
    { versionKey: false }
);

const Competence = mongoose.model<ICompetence, ICompetenceModel>("Competence", competenceSchema);

type CompetenceDocument = HydratedDocument<ICompetence & ICompetenceInstanceMethods>;

export default Competence;
export {
    ICompetence,
    Competence,
    CompetenceDocument
};
