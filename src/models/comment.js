import { types, flow } from "mobx-state-tree";
import { values } from "mobx";

import { DateTime } from "./custom";
import { User } from "./user";
import * as commentsAPI from "../utils/api/commentsAPI";

const Comment = types
    .model({
        id: types.identifier,
        author: User,
        text: types.string,
        createdAt: DateTime
    })
    .actions(self => ({
        update: flow(function* (text) {
            const previousText = self.text;
            self.text = text;

            const response = yield commentsAPI.updateComment(self.id, text);

            if (!response.ok) 
                self.text = previousText;
        }),
        delete: flow(function* () {
            yield commentsAPI.deleteComment(self.id);
        })
    }));

const CommentsStore = types
    .model({
        comments: types.map(Comment),
        loaded: false
    })
    .views(self => ({
        array() {
            return values(self.comments);
        },
        get(id) {
            return self.comments[id];
        }
    }))
    .views(self => ({
        get size() {
            return self.comments.size;
        }
    }))
    .actions(self => ({
        load: flow(function* (gameId) {
            const response = yield commentsAPI.getComments(gameId);
            
            if (response.ok) {
                const json = yield response.json();

                const comments = {};
                json.forEach((c) => comments[c.id] = c); 

                self.comments = comments;

                self.loaded = true;
            }
        }),
        add: flow(function* (gameId, text) {
            const response = yield commentsAPI.addComment(gameId, text);
            const json = yield response.json();

            if (response.ok)
                self.comments.put(json);
        }),
        delete(id) {
            self.comments.delete(id);
        }
    }));

export {
    Comment,
    CommentsStore
};

