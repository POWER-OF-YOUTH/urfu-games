import { types, flow, getParent } from "mobx-state-tree";
import { values } from "mobx";

import { DateTime } from "./custom";
import { User } from "./user";
import * as commentsAPI from "../utils/api/commentsAPI";

const Author = User;

const Comment = types
    .model({
        id: types.identifier,
        gameId: types.string,
        author: Author,
        text: types.string,
        createdAt: DateTime
    })
    .actions(self => ({
        update: flow(function* (text) {
            const previousText = self.text;
            self.text = text;

            const token = localStorage.getItem("token");

            const response = yield commentsAPI.updateComment(token, self.gameId, self.id, text);

            if (!response.ok) 
                self.text = previousText;
        }),
        delete() {
            const parent = getParent(self, 2);

            parent.delete(self.id);
        }
    }));

const CommentsStore = types
    .model({
        gameId: types.string,
        comments: types.optional(types.map(Comment), {}),
    })
    .views(self => ({
        orderedByDateAscending() {
            return values(self.comments).sort((c) => c.createdAt);
        },
        orderedByDateDescending() {
            return values(self.comments).sort((c) => -c.createdAt);
        }
    }))
    .actions(self => ({
        load: flow(function* () {
            const response = yield commentsAPI.getComments(self.gameId);
            
            if (response.ok) {
                const json = yield response.json();

                const comments = {};

                // Преобразуем массив комментариев в Map
                json.forEach((c) => comments[c.id] = c); 

                self.comments = comments;
            }
        }),
        add: flow(function* (text) {
            const token = localStorage.getItem("token");

            const response = yield commentsAPI.addComment(token, self.gameId, text);
            const json = yield response.json();

            if (response.ok)
                self.comments.put(json);
        }),
        delete: flow(function* (commentId) {
            const comment = self.comments[commentId];
            self.comments.delete(commentId);

            const token = localStorage.getItem("token");
            
            const response = yield commentsAPI.deleteComment(token, self.gameId, commentId);
            
            if (!response.ok)
                self.comments.put(comment);
        })
    }));

export{
    Comment,
    CommentsStore
};

