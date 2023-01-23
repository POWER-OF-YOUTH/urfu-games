/**
 * @file Содержит маршруты для работы с данными пользователей.
 */

import express from "express";
import { body, query } from "express-validator";
import { asyncMiddleware } from "middleware-async";

import User, { Role, deleteUser } from "../domain/models/user";
import UserDTO from "../domain/dto/user-dto";
import sequelize from "../sequelize";
import validateRequest from "../validators/validate-request";
import verifyToken from "../validators/verify-token";
import { AccessError } from "../utils/errors";

const usersRouter = express.Router();

/** Возвращает информацию о множестве пользователей. */
usersRouter.get("/users/",
    validateRequest(
        query("start")
            .default(0)
            .isInt({ gt: -1 })
            .toInt(),
        query("count")
            .default(10)
            .isInt({ gt: 0, lt: 100 })
            .toInt(),
        query("role")
            .default(0)
            .toInt()
    ),
    asyncMiddleware(
        async (req, res) => {
            await sequelize.transaction(async (transaction) => {
                const users = await User.findAll({
                    transaction,
                    offset: req.query.start,
                    limit: req.query.count,
                    where:
                    {
                        role: req.query.role
                    }
                });

                res.json(await Promise.all(
                    users.map((u) => UserDTO.create(u))
                ));
            });
        }
    )
);

/** Возвращает информацию о пользователе `userId`. */
usersRouter.get("/users/:userId",
    asyncMiddleware(
        async (req, res) => {
            await sequelize.transaction(async (transaction) => {
                const user = await User.findByPk(
                    req.params.userId,
                    { transaction, rejectOnEmpty: true }
                );
                res.json(await UserDTO.create(user));
            });
        }
    )
);

/** Обновляет данные пользователя `userId` */
usersRouter.put("/users/:userId",
    verifyToken,
    validateRequest(
        body("name")
            .optional()
            .isLength({ min: 0, max: 50 }),
        body("surname")
            .optional()
            .isLength({ min: 0, max: 50 }),
        body("patronymic")
            .optional()
            .isLength({ min: 0, max: 50 }),
        body("email")
            .optional()
            .isEmail()
    ),
    asyncMiddleware(
        async (req, res) => {
            await sequelize.transaction(async (transaction) => {
                const user = await User.findByPk(
                    req.params.userId,
                    { transaction, rejectOnEmpty: true }
                );

                if (user.id !== req.user.id)
                    throw new AccessError();

                user.set(req.body);
                await user.save({ transaction });

                res.json(await UserDTO.create(user));
            });
        }
    )
);

usersRouter.delete("/users/:userId",
    verifyToken,
    asyncMiddleware(
        async (req, res) => {
            const initiator = await User.findByPk(req.user.id, { rejectOnEmpty: true });
            if (initiator.role !== Role.Admin)
                throw new AccessError("Initiator should be admin", 403);

            await deleteUser(req.params.userId);
            res.status(200).send();
        }
    )
);

export default usersRouter;
