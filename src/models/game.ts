import mongoose, { Schema } from 'mongoose';

const gameSchema = new Schema(
    {
        id: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        competencies: {
            type: [String],
            required: true
        },
        image: {
            type: String,
            default: "none"
        },
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            default: ""
        },
        rating: { // Число [0;5]
            type: Number
        },
        author: {
            type: String,
            required: true
        },       
        participants: {
            type: [String],
            default: []
        },
        creation_date: {
            type: Date,
            default: Date.now()
        }
    },
    { versionKey: false }
)

const Game = mongoose.model("Game", gameSchema);

export default Game;
