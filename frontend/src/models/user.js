import { types, flow, applySnapshot } from "mobx-state-tree";

import * as usersAPI from "../utils/api/usersAPI";
import { DateTime } from "./custom";

const User = types
    .model({
        id: types.identifier,
        login: "",
        email: "",
        role: 0,
        name: types.maybeNull(types.string),
        surname: types.maybeNull(types.string),
        patronymic: types.maybeNull(types.string),
        avatar: types.maybeNull(types.string),
        createdAt: types.maybeNull(DateTime),

        loaded: false,
    })
    .views(self => ({
        isAdmin() {
            return self.role === 1;
        },
        isModerator() {
            return self.role === 2;
        }
    }))
    .actions(self => ({
        update: flow(function* (data = {}) {
            const response = yield usersAPI.updateUser(self.id, data);

            if (response.ok) {
                const json = yield response.json();

                applySnapshot(self, json);
            }
        }),
        load: flow(function* (userId) {
            const userResponse = yield usersAPI.getUser(userId);

            applySnapshot(self, userResponse.data);
            self.loaded = true;
        }),
        delete: async function () {
            return usersAPI.deleteUser(self.id).then(
                response => response.ok,
                err => {
                    console.log(err);
                    return false;
                }
            );
        },
    }));

const UsersStore = types
    .model({
        users: types.map(User)
    })
    .actions(self => ({
        load: flow(function* (ids = []) {
            ids = ids.filter(id => !self.users.has(id));

            if (ids.length > 0) {
                const response = yield usersAPI.getUsers(ids);

                if (response.ok) {
                    const json = yield response.json();

                    let users = {};
                    json.forEach((u) => {
                        users[u.id] = u;
                        u.loaded = true;
                    });

                    applySnapshot(self.users, users);
                }
            }
        })
    }));

export {
    User,
    UsersStore
};
