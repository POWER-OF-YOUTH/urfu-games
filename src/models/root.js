import React from "react";

import AuthStore from "./auth";
import { types } from "mobx-state-tree";

const RootStore = types
    .model({
        authStore: types.optional(AuthStore, {}),
    });

const RootStoreContext = React.createContext(null);

export default RootStore;
export {
    RootStore,
    RootStoreContext
};

