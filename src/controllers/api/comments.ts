import { v4 as uuid } from "uuid";
import { Request, Response, NextFunction } from "express";
import { matchedData } from "express-validator";
import { Document } from "mongoose";

import { DatabaseError, LogicError, AccessError } from "../../utils/errors";
import { Comment, IComment } from "../../models/comment";
import { Game, IGame } from "../../models/game";
import { Role } from "../../models/user";
import { DTO } from "../../utils/dto/comment";

type CommentDocument = IComment & Document<any, any, IComment>;

type AddCommentData = {
    gameId: string,
    text: string
}

type GetCommentData = {
    id: string
}

type GetCommentsData = {
    gameId: string | undefined,
    author: string | undefined
}

export async function addComment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const data = <AddCommentData> matchedData(req, { locations: [ "params" ] });
        const user: any = req.user;

        const id: string = uuid();
        const comment: CommentDocument = await Comment.create({
            ...data,
            id,
            author: user.id
        });
        
        res.json(new DTO.Comment(comment));
    }
    catch (err) {
        next(err);
    }
}

export async function getComment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const data = <GetCommentData> matchedData(req, { locations: [ "params" ] });
        const comment: CommentDocument = await Comment.findOne({ id: data.id });

        res.json(new DTO.Comment(comment));
    }
    catch (err) {
        next(err);
    }
}

export async function getComments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const data = <GetCommentsData> matchedData(req, { locations: [ "query" ] });
        const comments = await Comment.find(data);

        res.json(comments.map(c => new DTO.Comment(c)));
    }
    catch (err) {
        next(err);
    }
    
}
