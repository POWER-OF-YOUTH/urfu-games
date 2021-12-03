import { 
    types, 
    flow, 
    applySnapshot,
    getSnapshot
} from "mobx-state-tree";

import { DateTime } from "./custom";
import { User } from "./user";
import { CommentsStore } from "./comment";
import * as gamesAPI from "../utils/api/gamesAPI";
import { values } from "mobx";
const Game = types
    .model({
        id: types.identifier,
        competencies: types.array(types.string),
        image: types.string,
        name: types.string,
        description: types.string,
        rating: types.number,
        author: User,
        participants: types.array(User),
        url: types.string,
        uploaded: types.boolean,
        createdAt: DateTime,
        comments: types.maybe(CommentsStore)
    })
    .actions(self => ({
        afterCreate() {
            self.comments = CommentsStore.create({ gameId: self.id });
        },
        rate(rate) { 
            /* TODO: Rates */ 
            self.rating = rate;
        },
        update: flow(function* (data) {
            const oldData = getSnapshot(self);
            const newData = { ...oldData, ...data };

            applySnapshot(self, newData);
            
            const response = yield gamesAPI.updateGame(self.id, data);

            if (!response.ok)
                applySnapshot(self, oldData);
        }),
        comment(text) {
            self.comments.add(text);
        }
    }));

const GamesStore = types
    .model({
        games: types.map(Game),
    })
    .views(self => ({
        all(){
            return values(self.games);
        }
    }))
    .actions(self => ({
        loadGames: flow(function* () {
            const response = yield gamesAPI.getGames(); 

            if (response.ok) {
                const json = yield response.json();

                const games = {};

                json.forEach(g => games[g.id] = g);

                self.games = games;
            }
        }),
        loadGame: flow(function* (gameId) { 
            if (!self.games.has(gameId))
            {
                const response = yield gamesAPI.getGame(gameId);

                if (response.ok) {
                    const json = yield response.json();

                    self.games.put(json);
                }
            }    
        }),
        deleteGame: flow(function* (gameId) { 
            const game = self.games[gameId];
            
            self.games.delete(gameId);

            const response = yield gamesAPI.deleteGame(gameId);

            if (!response.ok) 
                self.games.put(game);
        })
    }));

async function fetchGame(gameId) {
    const response = await gamesAPI.getGame(gameId);

    if (response.ok)
        return Game.create(await response.json());
    return Promise.reject(response);
}

export { Game, GamesStore, fetchGame };
