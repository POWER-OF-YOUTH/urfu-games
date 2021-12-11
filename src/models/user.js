import { types, flow, applySnapshot } from "mobx-state-tree";

import * as usersAPI from "../utils/api/usersAPI";
import { DateTime } from "./custom";

const User = types
    .model({
        id: types.identifier,
        login: types.string,
        email: types.string,
        role: types.number,
        name: types.string,
        surname: types.string,
        patronymic: types.string,
        avatar: "",
        createdAt: DateTime,
    })
    .views(self => ({
        isAdmin() {
            return self.role === 1;
        }
    }))
    .actions(self => ({
        update: flow(function* (id, data = {}) {
            const response = yield usersAPI.updateUser(id, data);

            if (response.ok) {
                const json = yield response.json();

                applySnapshot(self, json);
            }
        })
    }));

const UsersStore = types
    .model({
        users: types.optional(types.map(User), {})
    })
    .actions(self => ({
        loadUsers: flow(function* (ids = []) {
            ids = ids.filter(id => !self.users.has(id));

            if (ids.length > 0) {
                const response = yield usersAPI.getUsers(ids);

                if (response.ok) {
                    const json = yield response.json();

                    let users = {};
                    json.forEach((u) => users[u.id] = u);

                    applySnapshot(self.users, users);
                }
            }
        }),
        loadUser: flow(function* (id) {
            if (!self.users.has(id)) {
                const response = yield usersAPI.getUser(id);

                if (response.ok) {
                    const json = yield response.json();

                    const user = json;

                    self.users.set(user.id, user);
                }

                console.log(self.toJSON());
            }
        })
    }));

export {
    User,
    UsersStore
};
