/**
 * @file Глобальное хранилище.
 */

import React from "react";
import { types, flow } from "mobx-state-tree";

import { AuthStore } from "./auth";
import { User } from "./user";

const RootStore = types
    .model({
        auth: types.optional(AuthStore, {}),
        // user: types.maybeNull(types.reference(User)),
    })
    .actions(self => ({
        /** Ицициализирует глобальное хранилище. */
        initialize: flow(function* () {
            yield self.auth.check();
            self.user = self.auth.user;
        })
    }));


const RootStoreContext = React.createContext(null);

export default RootStore;
export {
    RootStore,
    RootStoreContext
};

