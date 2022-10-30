/**
 * @file Тестирование REST API.
 */

import { assert } from "chai";

import app from "../src/app.ts";
import sequelize from "../src/sequelize.js";

import axios from "./axios.js";

let server = null;

beforeEach(async function () {
    if (server !== null) {
        server.close();
    }

    await sequelize.sync({ force: true });

    server = app.listen(3000);
});

describe("Users", function () {
    describe("Signup", function () {
        it("Succeed_WhenUserWithNotExists", async function () {
            const body = {
                login: "user",
                email: "user@example.com",
                password: "Password1234"
            };

            const signupResponse = await axios.post(
                "/auth/signup",
                body,
                { validateStatus: false }
            );

            assert.equal(signupResponse.status, 200, JSON.stringify(signupResponse.data));
            assert.hasAnyKeys(signupResponse.headers, "location");
        });
    });

    describe("Signin", function () {
        if("Succeed_WhenUserExists", async function () {
            await axios.post(
                "/auth/signup",
                { login: "user", email: "user@example.com", password: "Password1234" }
            );

            const signinResponse = await axios.post(
                "/auth/signin",
                { login: "user", password: "Password1234" },
                { validateStatus: false }
            );

            assert.equal(signinResponse, 200, JSON.stringify(signinResponse.data));
            assert.hasAllKeys(signinResponse.data, ["access_token"]);
        });
    });
});

describe("Games", function () {
    // Подготовка пользователей, от имени которых будут посылаться запросы.
    let users = [];
    beforeEach(async function () {
        users = [];

        // Подготовка пользователя.
        const signupResponse = await axios.post(
            "/auth/signup",
            { login: "user", email: "user@example.com", password: "Password1234" }
        );
        const signinResponse = await axios.post(
            "/auth/signin",
            { login: "user", password: "Password1234" }
        );
        users.push({
            data: signupResponse.data,
            accessToken: signinResponse.data["access_token"]
        })
    });
    // Подготовка компетенций.
    let competencies = [];
    beforeEach(async function () {
        competencies = [];

        const names = ["Math", "English", "C++", "Python"];
        for (let name of names) {
            const competenceResponse = await axios.post(
                "/competencies",
                { name, description: name },
                {
                    headers: {
                        "Authorization": `Bearer ${users[0].accessToken}`
                    }
                }
            );

            competencies.push(competenceResponse.data);
        }
    });

    describe("CreateGame", function () {
        it("Succeed_WhenBodyCorrect", async function () {
            const body = {
                name: "MyGame",
                description: "",
                image: "https://i.ibb.co/C9VKrMC/default-avatar.png",
                participants: [],
                competencies: [ competencies[0].id ],
                checkpoints: [
                    {
                        name: "checkpoint01",
                        description: "description",
                        competence: competencies[0].id
                    }
                ],
                loaderUrl: "https://i.ibb.co/C9VKrMC/default-avatar.png",
                dataUrl: "https://i.ibb.co/C9VKrMC/default-avatar.png",
                frameworkUrl: "https://i.ibb.co/C9VKrMC/default-avatar.png",
                codeUrl: "https://i.ibb.co/C9VKrMC/default-avatar.png"
            };

            const gameResponse = await axios.post(
                "/games",
                body,
                {
                    headers: {
                        "Authorization": `Bearer ${users[0].accessToken}`
                    },
                    validateStatus: false
                }
            );

            assert.equal(gameResponse.status, 200, JSON.stringify(gameResponse.data));
            assert.hasAnyKeys(gameResponse.headers, "location");
            assert.hasAllKeys(
                gameResponse.data,
                [
                    "id",
                    "name",
                    "description",
                    "image",
                    "participants",
                    "competencies",
                    "loaderUrl",
                    "dataUrl",
                    "frameworkUrl",
                    "codeUrl",
                    "isPublicated",
                    "rating",
                    "createdAt"
                ],
                JSON.stringify(gameResponse.data)
            );
        });
    });
});

after(async function () {
    server.close();
    await sequelize.drop();
    await sequelize.close();
});
