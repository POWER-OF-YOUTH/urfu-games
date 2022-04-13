import { v4 as uuid } from "uuid";
import mongoose, { Schema, HydratedDocument, Model } from "mongoose";

import { User, UserDocument } from "./user";
import { Comment, CommentDocument } from "./comment";
import { Rating, RatingDocument } from "./rating";
import { Competence, CompetenceDocument } from "./competence";

interface IGame {
    id: string;
    competencies: Array<string>;
    image: string;
    name: string;
    description: string;
    rating: number;
    author: string;
    participants: Array<string>;
    loaderUrl: string;
    dataUrl: string;
    frameworkUrl: string;
    codeUrl: string;
    uploaded: boolean;
    createdAt: Date;
}

interface IGameInstaceMethods { 
    getAuthor(): Promise<UserDocument>;

    getParticipants(): Promise<Array<UserDocument>>;

    comment(text: string, author: UserDocument): Promise<CommentDocument>;

    hasComment(id: string): Promise<boolean>;

    getComment(id: string): Promise<CommentDocument>;

    getComments(start: number, count: number): Promise<Array<CommentDocument>>;

    getComments(start: number, count: number, author: UserDocument): Promise<Array<CommentDocument>>;

    deleteComment(id: string): Promise<void>;

    rate(value: number, author: UserDocument): Promise<RatingDocument>;

    getRating(id: string): Promise<RatingDocument>;

    getRating(author: UserDocument): Promise<RatingDocument>;

    getRatings(start: number, count: number): Promise<Array<RatingDocument>>;

    deleteRate(author: UserDocument): Promise<void>;

    // competencies
    addCompetence(competence: CompetenceDocument): Promise<void>;

    addCompetencies(competencies: Array<CompetenceDocument>): Promise<void>;

    getCompetencies(): Promise<Array<CompetenceDocument>>;

    hasCompetence(id: string): Promise<boolean>;

    hasCompetence(competence: CompetenceDocument): Promise<boolean>;

    removeCompetence(id: string): Promise<void>;

    removeCompetence(competence: CompetenceDocument): Promise<void>;
    // ---
}

interface IGameModel extends Model<IGame, any, IGameInstaceMethods> { }

const gameSchema = new Schema<IGame, IGameModel>(
    {
        id: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        competencies: {
            type: [String],
            default: []
        },
        image: {
            type: String,
            default: ""
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
            type: Number,
            default: 0
        },
        author: {
            type: String,
            ref: "User",
            required: true,
            index: true
        },       
        participants: {
            type: [String],
            default: []
        },
        loaderUrl: {
            type: String,
            default: ""
        },
        dataUrl: {
            type: String,
            default: ""
        },
        frameworkUrl: {
            type: String,
            default: ""
        },
        codeUrl: {
            type: String,
            default: ""
        },
        uploaded: {
            type: Boolean,
            default: false
        },
        createdAt: {
            type: Date
        }
    },
    { versionKey: false }
);

// instance methods
gameSchema.method("getAuthor", async function () {
    const author: UserDocument = await User.findOne({ id: this.author }); 

    if (author === null)
        throw new Error("Пользователь не найден.");

    return author;
});

gameSchema.method("getParticipants", async function () {
    const participants: Array<UserDocument> = await User.find({ 
        id: { $in: this.participants }
    });

    if (participants.length !== this.participants.length) {
        throw new Error("Один или несколько участников не найдены.");
    }

    return participants;
});

gameSchema.method("comment", async function (
    text: string, 
    author: UserDocument
): Promise<CommentDocument> {
    const comment: CommentDocument = await Comment.create({
        id: uuid(),
        text: text,
        game: this.id,
        author: author.id,
        createdAt: Date.now()
    });

    return comment;
});

gameSchema.method("hasComment", function (
    id: string
): Promise<boolean> {
    return Comment.exists({ id, game: this.id });
});

gameSchema.method("getComment", function (id: string) {
    return Comment.findOne({ id, game: this.id });
});

gameSchema.method("getComments", async function (
    start: number, count: number, author?: UserDocument
) {
    if (author === undefined) {
        return await Comment.find({ game: this.id })
            .sort("createdAt")
            .skip(start)
            .limit(count);
    }
    else {
        return await Comment.find({ game: this.id, author: author.id })
            .sort("createdAt")
            .skip(start)
            .limit(count);
    }
})

gameSchema.method("deleteComment", async function (
    id: string
): Promise<void> {
    await Comment.deleteOne({ id, game: this.id });
});

gameSchema.method("rate", async function (value: number, author: UserDocument) {
    // delete old user rating if exists
    if (await Rating.exists({ game: this.id, author: author.id }))
        await Rating.deleteOne({ game: this.id, author: author.id });

    const rating: RatingDocument = await Rating.create({
        id: uuid(),
        game: this.id,
        author: author.id,
        value,
        createdAt: Date.now()
    });

    const ratings: Array<RatingDocument> = await Rating.find({ game: this.id });

    let averageRating = 0;
    for (const r of ratings) 
        averageRating += r.value / ratings.length;

    this.rating = averageRating;

    return rating;
});

gameSchema.method("getRating", async function (obj: string | UserDocument) {
    if (typeof obj === "string")
        return await Rating.findOne({ id: obj, game: this.id });
    else
        return await Rating.findOne({ game: this.id, author: obj.id });
})

gameSchema.method("getRatings", async function (start: number, count: number) {
    const ratings: Array<RatingDocument> = await Rating.find({ 
        game: this.id 
    })
        .sort("createdAt")
        .skip(start)
        .limit(count);

    return ratings;
});

gameSchema.method("deleteRate", async function (author: UserDocument) {
    const rating: RatingDocument = await Rating.findOne({ 
        game: this.id, 
        author: author.id 
    });

    await rating.delete();

    const ratings: Array<RatingDocument> = await Rating.find({ game: this.id });

    let averageRating = 0;
    for (const r of ratings) 
        averageRating += r.value / ratings.length;

    this.rating = averageRating;
})

gameSchema.method("addCompetence", async function (competence: CompetenceDocument) {
    if (competence.isNew)
        throw new Error("Компетенция не сохранена.");
    else if (this.hasCompetence(competence.id))
        throw new Error("Компетенция уже добавлена.");

    this.competencies.push(competence.id);
});

gameSchema.method("addCompetencies", async function (
    competencies: Array<CompetenceDocument>
): Promise<void> {
    const ids: Set<string> = new Set(this.competencies);

    for (const competence of competencies) {
        if (competence.isNew)
            throw new Error("Одна или несколько компетенций не сохранены.");
        else if (ids.has(competence.id))
            throw new Error("Компетенция уже прикреплена к игре.");

        ids.add(competence.id);
    }

    this.competencies = Array.from(ids);
});

gameSchema.method("getCompetencies", function ()
    : Promise<Array<CompetenceDocument>> {
    return Competence.find({ id: { $in: this.competencies }});
});

gameSchema.method("hasCompetence", function (
    obj: string | CompetenceDocument
): Promise<boolean> {
    const competenceId: string = typeof obj === "string" ? obj : obj.id;

    return this.competencies.includes(competenceId);
});

gameSchema.method("removeCompetence", async function (
    obj: string | CompetenceDocument
): Promise<void> {
    if (!this.hasCompetence(obj))
        throw new Error("Данная компетенция не прикреплена к игре.");

    const competenceId: string = typeof obj === "string" ? obj : obj.id;

    this.competencies.splice(this.competencies.indexOf(competenceId), 1);
})
// ---

const Game = mongoose.model<IGame, IGameModel>("Game", gameSchema);

type GameDocument = HydratedDocument<IGame & IGameInstaceMethods>;

export default Game;
export {
    IGame,
    Game,
    GameDocument
};
