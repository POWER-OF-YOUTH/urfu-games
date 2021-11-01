import validator from "validator";
import { types, flow, applySnapshot } from "mobx-state-tree";

import authAPI from "../utils/api/authAPI";
import { User } from "./user";
import { APIError } from "./custom";

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
        errors: types.optional(types.array(APIError), []),
        isLoading: false,
        authenticated: false
    })
    .actions(self => ({
        afterCreate() {
            self.check();
        },
        signUp: flow(function* (data) {
            self.isLoading = true;
    
            self.errors.clear();
    
            const validationErrors = validateSignUpData(data);
            if (validationErrors.length > 0)
                self.errors = validationErrors; 
            else {
                const response = yield authAPI.signUp(data); 
                const json = yield response.json();

                if (response.ok)
                    applySnapshot(self, json);
                else
                    self.errors = json.errors;
            }
            
            self.isLoading = false;
        }),       
        signIn: flow(function* (data) {
            self.isLoading = true;

            self.errors.clear();

            const response = yield authAPI.signIn(data);
            const json = yield response.json();

            if (response.ok) {
                applySnapshot(self, json);

                self.authenticated = response.ok;

                localStorage.setItem("token", json.token);
            }
            else
                self.errors = json.errors;

            self.isLoading = false;
        }),
        check: flow(function* () {
            self.isLoading = true;   

            self.errors.clear();

            self.token = localStorage.getItem("token");
            if (self.token) {
                const response = yield authAPI.check(self.token);
                const json = yield response.json();

                if (response.ok) {
                    applySnapshot(self, json);

                    self.authenticated = true;
                }
                else
                    self.errors = json.errors;
            }

            self.isLoading = false;
        })
    }));

export default AuthStore;
