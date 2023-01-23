import { values } from "mobx";
import {
    types,
    flow,
    applySnapshot
} from "mobx-state-tree";

import * as gamesAPI from "../utils/api/gamesAPI";
import { DateTime } from "./custom";
import { User } from "./user";
import { Competence } from "./competence";
import { CommentsStore } from "./comment";
import * as globals from "../globals";

const Game = types
    .model({
        id: "",
        competencies: types.array(Competence),
        image: "",
        name: "",
        description: "",
        rating: 0,
        author: types.maybeNull(User),
        participants: types.array(User),
        codeUrl: types.maybeNull(types.string),
        dataUrl: types.maybeNull(types.string),
        frameworkUrl: types.maybeNull(types.string),
        loaderUrl: types.maybeNull(types.string),
        isPublicated: false,
        createdAt: types.maybeNull(DateTime),
        comments: types.optional(CommentsStore, () => CommentsStore.create()),
        loaded: false
    })
    .actions(self => ({
        setName(name) {
            self.name = name;
        },
        setDescription(description) {
            self.description = description;
        },
        setCodeUrl(url) {
            self.codeUrl = url;
        },
        setDataUrl(url) {
            self.dataUrl = url;
        },
        setFrameworkUrl(url) {
            self.frameworkUrl = url;
        },
        setLoaderUrl(url) {
            self.loaderUrl = url;
        },
        comment(text) {
            self.comments.add(self.id, text);
        },
        rate: flow(function* (value) {
            if (value != null) {
                yield gamesAPI.rateGame(self.id, value);

                const gameResponse = yield gamesAPI.getGame(self.id);

                const gameJSON = gameResponse.data;

                self.rating = gameJSON.rating;

                if (process.env.NODE_ENV !== undefined && process.env.NODE_ENV !== "development") {
                    window.ym(globals.YM_ID, "reachGoal", "rate_game"); 
                }
            }
        }),
        delete: flow(function* () {
            yield gamesAPI.deleteGame(self.id);
        }),
        publish: flow(function* () {
            yield gamesAPI.patchGame(self.id, { isPublicated: true });
        }),
        load: flow(function* (gameId) {
            const gameResponse = yield gamesAPI.getGame(gameId);

            applySnapshot(self, gameResponse.data);
            self.loaded = true;
        }),
        loadComments: flow(function* () {
            yield self.comments.load(self.id);
        }),
        save: flow(function* () {
            yield gamesAPI.updateGame(
                self.id, 
                {
                    name: self.name,
                    description: self.description,
                    codeUrl: self.codeUrl,
                    dataUrl: self.dataUrl,
                    frameworkUrl: self.frameworkUrl,
                    loaderUrl: self.loaderUrl,
                }
            );
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
        load: flow(function* (start = 0, count = 10, isPublicated = true) {
            const response = yield gamesAPI.getGames(start, count, isPublicated);

            const json = response.data;

            const games = {};
            json.forEach(g => games[g.id] = g);

            self.games = games;
        }),
        delete(id) {
            self.games.delete(id);
        },
        loadForUser: flow(function* (userId){
            const response = yield gamesAPI.getUserGames(userId);
            const games = {};
            const json = response.data;
            json.forEach(g => games[g.id] = g);
            self.games = games;
        })
    }));

export { Game, GamesStore };
