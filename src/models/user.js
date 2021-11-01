import { types } from "mobx-state-tree";

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
    });

export {
    User
};
