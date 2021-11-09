import React from "react";

import AuthStore from "./auth";
import { GamesStore } from "./game";

import { types } from "mobx-state-tree";

const RootStore = types
    .model({
        authStore: types.optional(AuthStore, {}),
        gamesStore: types.optional(GamesStore, {})
    });

const RootStoreContext = React.createContext(null);

export default RootStore;
export {
    RootStore,
    RootStoreContext
};

