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

export async function addComment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const data = <AddCommentData> matchedData(req, { locations: [ "body" ] });
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

type GetCommentData = {
    id: string
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

type GetCommentsData = {
    gameId: string | undefined,
    author: string | undefined
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

type UpdateCommentData = {
    id: string,
    text: string
}

export async function updateComment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const data = <UpdateCommentData> matchedData(req, { locations: [ "params", "body" ] });
        const user: any = req.user;
        const comment: CommentDocument = await Comment.findOne({ id: data.id });

        if (comment.author !== user.id && user.role !== Role.Admin)
            res.status(403).json({ errors: [ new AccessError(req.originalUrl) ] });
        else {
            comment.set({ text: data.text });

            await comment.save();

            res.json(new DTO.Comment(comment));
        }
    }
    catch (err) {
        next(err);
    }
}

type DeleteCommentData = {
    id: string
}

export async function deleteComment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const data = <DeleteCommentData> matchedData(req, { locations: [ "params" ] });
        const user: any = req.user;
        const comment: CommentDocument = await Comment.findOne({ id: data.id });

        if (comment.author !== user.id && user.role !== Role.Admin)
            res.status(403).json({ errors: [ new AccessError(req.originalUrl) ] });
        else {
            await comment.delete();

            res.json(new DTO.Comment(comment));
        }
    }
    catch (err) {
        next(err);
    }
}
