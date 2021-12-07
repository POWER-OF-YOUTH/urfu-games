import React from "react";

import AuthStore from "./auth";
import { GamesStore } from "./game";
import { CompetenciesStore } from "./competence";

import { types } from "mobx-state-tree";

const RootStore = types
    .model({
        games: types.optional(GamesStore, {}),
        auth: types.optional(AuthStore, {}),
        competencies: types.optional(CompetenciesStore, {})
    });


const RootStoreContext = React.createContext(null);

export default RootStore;
export {
    RootStore,
    RootStoreContext
};

