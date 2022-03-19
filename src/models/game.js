import { useState, useEffect } from "react";
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
import { values } from "mobx";

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
        codeUrl: "",
        dataUrl: "",
        frameworkUrl: "",
        loaderUrl: "",
        uploaded: false,
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
        }),
        load: flow(function* (gameId) {
            const gameResponse = yield gamesAPI.getGame(gameId);

            if (gameResponse.ok) {
                applySnapshot(self, yield gameResponse.json());
                self.loaded = true;
            }
            else
                throw new Error("Failed to load the game.");
        }),
        loadComments: flow(function* () {
            yield self.comments.load(self.id);
        }),
        save: flow(function* () {
            const updateGameResponse = yield gamesAPI.updateGame(
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

            if (!updateGameResponse.ok)
                throw new Error("Failed to update game.");
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

export { Game, GamesStore };
