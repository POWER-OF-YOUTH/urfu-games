import { 
    types, 
    flow 
} from "mobx-state-tree";

import * as gamesAPI from "../utils/api/gamesAPI";
import { DateTime } from "./custom";
import { User } from "./user";
import { Competence } from "./competence";
import { CommentsStore } from "./comment";
import { values } from "mobx";

const Game = types
    .model({
        id: types.identifier,
        competencies: types.array(Competence),
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
        rate: flow(function* (value) {
            if (value != null) {
                yield gamesAPI.rateGame(self.id, value);
                
                const gameResponse = yield gamesAPI.getGame(self.id);

                if (gameResponse.ok) {
                    const gameJSON = yield gameResponse.json();

                    self.rating = gameJSON.rating; 
                }

                if (process.env.NODE_ENV !== undefined && process.env.NODE_ENV !== "development") {
                    window.ym(86784357, "reachGoal", "rate_game"); 
                }
            }
        }),
        delete: flow(function* () {
            yield gamesAPI.deleteGame(self.id);
        })
    }));

const GamesStore = types
    .model({
        games: types.map(Game),
    })
    .views(self => ({
        array() {
            return values(self.games);
        },
        get(id) {
            return self.games[id];
        }
    }))
    .actions(self => ({
        load: flow(function* (start = 0, count = 10) {
            const response = yield gamesAPI.getGames(start, count); 

            if (response.ok) {
                const json = yield response.json();

                const games = {};
                json.forEach(g => games[g.id] = g);

                self.games = games;
            }
        }),
        delete(id) { 
            self.games.delete(id);
        }
    }));

async function fetchGame(id) {
    const response = await gamesAPI.getGame(id);

    if (response.ok)
        return Game.create(await response.json());
    return Promise.reject(response);
}

export { Game, GamesStore, fetchGame };
