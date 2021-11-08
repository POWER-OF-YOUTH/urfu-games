import { 
    types, 
    flow, 
    applySnapshot,
    getSnapshot
} from "mobx-state-tree";

import { DateTime } from "./custom";
import { User } from "./user";
import * as gamesAPI from "../utils/api/gamesAPI";

const Author = User;

const Game = types
    .model({
        id: types.identifier,
        competencies: types.array(types.string),
        image: types.string,
        name: types.string,
        description: types.string,
        rating: types.number,
        author: types.string,
        participants: types.array(types.string),
        url: types.string,
        uploaded: types.boolean,
        createdAt: DateTime
    })
    .actions(self => ({
        rate(rate) { /* TODO: Rates */ },
        update: flow(function* (data) {
            const oldData = getSnapshot(self);
            const newData = { ...oldData, ...data };

            applySnapshot(self, newData);
            
            const token = localStorage.getItem("token");
            const response = yield gamesAPI.updateGame(token, self.id, data);

            if (!response.ok)
                applySnapshot(self, oldData);
        }) 
    }));

const GamesStore = types
    .model({
        games: types.optional(types.map(Game), {})
    })
    .actions(self => ({
        afterCreate() {
            self.loadGames();
        },
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
            const response = yield gamesAPI.getGame(gameId);

            if (response.ok) {
                const json = yield response.json();

                self.games.put(json);
            }
        }),
        deleteGame: flow(function* (gameId) { 
            const game = self.games[gameId];
            
            self.games.delete(gameId);

            const token = localStorage.getItem("token");
            const response = yield gamesAPI.deleteGame(token, gameId);

            if (!response.ok) 
                self.games.put(game);
        })
    }));

export { Game, GamesStore };
