import React from "react";

import AuthStore from "./auth";
import { GamesStore } from "./game";

import { types } from "mobx-state-tree";

const RootStore = types
    .model({
        games: types.optional(GamesStore, {}),
        auth: types.optional(AuthStore, {})
    });


const RootStoreContext = React.createContext(null);

export default RootStore;
export {
    RootStore,
    RootStoreContext
};

