import { types, flow, applySnapshot } from "mobx-state-tree";
import { values, observable } from "mobx";

import { DateTime, APIError } from "./custom";
import * as commentsAPI from "../utils/api/commentsAPI";

const Comment = types
    .model({
        id: types.identifier,
        gameId: types.string,
        author: types.string,
        text: types.string,
        createdAt: DateTime
    })
    .actions(self => ({
        update(text) {
            self.text = text;
        }
    }));

const CommentsStore = types
    .model({
        gameId: types.string,
        comments: types.optional(types.map(Comment), {}),
    })
    .views(self => ({
        get orderedByDateAscending() {
            return values(self.comments).sort((c) => c.createdAt);
        },
        get orderedByDateDescending() {
            return values(self.comments).sort((c) => -c.createdAt);
        }
    }))
    .actions(self => ({
        afterCreate() {
            self.getComments();
        },
        getComments: flow(function* () {
            const options = {};
            //options.gameId = self.gameId;

            const response = yield commentsAPI.getComments(options);
            
            let json = yield response.json();

            if (response.ok) {
                const comments = {};

                // Преобразуем массив комментариев в Map
                json.forEach((c) => { comments[c.id] = c; }); 

                self.comments = comments;
            }
        }),
        addComment: flow(function* (text) {
            const token = localStorage.getItem("token");

            const response = yield commentsAPI.addComment(token, self.gameId, text);
            const json = yield response.json();

            if (response.ok)
                self.comments.put(json);
        }),
        deleteComment: flow(function *(id) {
            const token = localStorage.getItem("token");
            
            const response = yield commentsAPI.deleteComment(token, id);
            
            if (response.ok)
                self.comments.delete(id);
        })
    }));

export{
    Comment,
    CommentsStore
};

