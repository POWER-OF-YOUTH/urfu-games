import validator from "validator";
import { types, flow } from "mobx-state-tree";

import authAPI from "../utils/api/authAPI";
import { User } from "./user";
import { APIError } from "./custom";

import * as globals from "../globals";

function validateSignUpData(data) {
    const messages = [];

    if (!validator.matches(data.login, "[0-9a-zA-Z]+"))
        messages.push("Логин не соответствует указанному шаблону: [0-9a-zA-Z]+");
    if (!validator.isEmail(data.email))
        messages.push("Email указан неверно.");
    if (!validator.isLength(data.password, { min: 6, max: 30 }))
        messages.push("Пароль должен содержать от 6 до 30 символов.");
    if (!validator.matches(data.password, "[0-9a-zA-Z_\\-@#%., ]+"))
        messages.push("Пароль не соответствует указанному шаблону: [0-9a-zA-Z_\\-@#%., ]+.");
    if (!validator.equals(data.password, data.passwordRepeat))
        messages.push("Пароли не совпадают.");

    const errors = messages.map(m => new Error(m));

    return errors;
}

const AuthStore = types
    .model({
        user: types.maybeNull(User),
        token: types.maybeNull(types.string),
        errors: types.array(APIError),
        authenticated: false,
        checked: false
    })
    .actions(self => ({
        check: flow(function* () {
            self.token = localStorage.getItem("access_token");

            if (self.token) {
                const response = yield authAPI.check();
                const json = yield response.json();

                if (response.ok) {
                    self.errors.clear();

                    self.user = json;

                    self.authenticated = true;
                }
                else
                    self.errors = json.errors;
            }
            else {
                self.authenticated = false;
            }

            self.checked = true;
        }),
        signUp: flow(function* (data) {
            if (!self.authenticated) {
                self.errors.clear();

                const validationErrors = validateSignUpData(data);
                if (validationErrors.length > 0)
                    self.errors = validationErrors;
                else {
                    const response = yield authAPI.signUp(data);
                    const json = yield response.json();

                    if (response.ok) {
                        if (process.env.NODE_ENV === "production") {
                            window.ym(globals.YM_ID, "reachGoal", "signup");
                        }
                    }
                    else
                        self.errors = json.errors;
                }
            }
        }),
        signIn: flow(function* (data) {
            if (!self.authenticated) {
                const response = yield authAPI.signIn(data);
                const json = yield response.json();

                if (response.ok) {
                    self.errors.clear();

                    self.token = json.access_token;

                    localStorage.setItem("access_token", json.access_token);

                    yield self.check();

                    if (process.env.NODE_ENV === "production") {
                        window.ym(globals.YM_ID, "reachGoal", "signin");
                    }
                }
                else
                    self.errors = json.errors;
            }
        }),
        logout() {
            localStorage.removeItem("access_token");

            self.authenticated = false;
        },
        clearErrors() {
            self.errors.clear();
        }
    }));

export { AuthStore };
