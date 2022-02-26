import { types, flow } from "mobx-state-tree";
import { values } from "mobx";

import { DateTime } from "./custom";
import { User } from "./user";
import * as commentsAPI from "../utils/api/commentsAPI";

const Comment = types
    .model({
        id: types.identifier,
        game: types.string,
        author: User,
        text: types.string,
        createdAt: DateTime
    })
    .actions(self => ({
        update: flow(function* (text) {
            const previousText = self.text;
            self.text = text;

            const response = yield commentsAPI.updateComment(self.game, self.id, text);

            if (!response.ok) 
                self.text = previousText;
        }),
        delete: flow(function* () {
            yield commentsAPI.deleteComment(self.game, self.id);
        })
    }));

const CommentsStore = types
    .model({
        gameId: types.string,
        comments: types.map(Comment),
    })
    .views(self => ({
        array() {
            return values(self.comments);
        },
        get(id) {
            return self.comments[id];
        }
    }))
    .actions(self => ({
        load: flow(function* () {
            const response = yield commentsAPI.getComments(self.gameId);
            
            if (response.ok) {
                const json = yield response.json();

                const comments = {};
                json.forEach((c) => comments[c.id] = c); 

                self.comments = comments;
            }
        }),
        add: flow(function* (text) {
            const response = yield commentsAPI.addComment(self.gameId, text);
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

