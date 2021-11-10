import React from "react";

import AuthStore from "./auth";
import { GamesStore } from "./game";

import { types } from "mobx-state-tree";

const RootStore = types
    .model({
        gamesStore: types.optional(GamesStore, {}),
        authStore: types.optional(AuthStore, {})
    });

const RootStoreContext = React.createContext(null);

export default RootStore;
export {
    RootStore,
    RootStoreContext
};

