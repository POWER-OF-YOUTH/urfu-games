import { v4 as uuid } from "uuid";
import { Request, Response, NextFunction } from "express";
import { matchedData } from "express-validator";
import { Document } from "mongoose";

import { AccessError } from "../../../utils/errors";
import { Comment, IComment } from "../../../models/comment";
import { Role, User } from "../../../models/user";
import CommentDTO from "../../../utils/dto/comment";

type CommentDocument = IComment & Document<any, any, IComment>;

type AddCommentData = {
    gameId: string,
    text: string
}

export async function addComment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const user: any = req.user;
        const data = <AddCommentData> matchedData(req, { locations: [ "body", "params" ] });

        const id: string = uuid();
        const author = await User.findOne({ id: user.id });
        const comment: CommentDocument = await Comment.create({
            ...data,
            id,
            author: author._id,
            createdAt: Date.now()
        })
            .then(c => c.populate("author").execPopulate());

        res.json(new CommentDTO(comment));
    }
    catch (err) {
        next(err);
    }
}

type GetCommentData = {
    commentId: string
}

export async function getComment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const data = <GetCommentData> matchedData(req, { locations: [ "params" ] });
        const comment: CommentDocument = await Comment
            .findOne({ id: data.commentId })
            .populate("author");

        res.json(new CommentDTO(comment));
    }
    catch (err) {
        next(err);
    }
}

type GetCommentsData = {
    gameId: string | undefined,
}

export async function getComments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const data = <GetCommentsData> matchedData(req, { locations: [ "params" ] });
        const comments = await Comment
            .find({ gameId: data.gameId })
            .populate("author");

        res.json(comments.map(c => new CommentDTO(c)));
    }
    catch (err) {
        next(err);
    }
}

type UpdateCommentData = {
    commentId: string,
    text: string
}

export async function updateComment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const user: any = req.user;
        const data = <UpdateCommentData> matchedData(req, { locations: [ "params", "body" ] });
        const comment: CommentDocument = await Comment
            .findOne({ id: data.commentId })
            .populate("author");

        if (comment.author.id !== user.id)
            res.status(403).json({ errors: [ new AccessError(req.originalUrl) ] });
        else {
            comment.set({ text: data.text });

            await comment.save();

            res.json(new CommentDTO(comment));
        }
    }
    catch (err) {
        next(err);
    }
}

type DeleteCommentData = {
    commentId: string
}

export async function deleteComment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const user: any = req.user;
        const data = <DeleteCommentData> matchedData(req, { locations: [ "params" ] });
        const comment: CommentDocument = await Comment
            .findOne({ id: data.commentId })
            .populate("author");

        if (comment.author.id !== user.id && user.role !== Role.Admin)
            res.status(403).json({ errors: [ new AccessError(req.originalUrl) ] });
        else {
            await comment.delete();

            res.json(new CommentDTO(comment));
        }
    }
    catch (err) {
        next(err);
    }
}
