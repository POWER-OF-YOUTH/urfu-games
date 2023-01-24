import React, { useCallback, useEffect } from "react";
import PageTitle from "../components/PageTitle";
import { Helmet } from "react-helmet";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import { User } from "../models/user";
import { useStore } from "../hooks";
import styles from "./UserProfilePage.module.css";
import PageLayout from "../layouts/PageLayout";
import GameCard from "../components/GameCard";
import { GamesStore } from "../models/game";
import Competence from "../components/Competence";
import { Button } from "@mui/material";

function UserProfilePage({ history }) {

    const { userId } = useParams();
    const { auth } = useStore();

    const user = useLocalObservable(() => User.create({ id: userId }));
    useEffect(() => { user.load(userId).catch(err => console.error(err)); }, []);
    const gamesStore = useLocalObservable(() => GamesStore.create());
    useEffect(() => { gamesStore.loadForUser(userId).catch(err => console.error(err)); }, []);

    const competencies = [];

    const renderGames = useCallback((games) => (
        <div className={styles.games}>
            <h2>Загруженные игры</h2>
            <div className={styles.games__list}>
                {games.map((g, i) =>
                    (<GameCard key={i} game={g} />)
                )}
            </div>
        </div>
    ), []);
    const renderCompetencies = useCallback((competencies) => (
        <div>
            <h2>Компетенции</h2>
            <div className={styles.cWrapper}>
                {competencies.map((c) => (
                    <Competence key={c.id} competence={c} enablePopup={true} />
                ))}
            </div>
        </div>
    ), []);

    return (
        <>
            <Helmet>
                <title>
                    {user.loaded ? `${user.login} | Профиль` : "Загрузка"}
                </title>
            </Helmet>
            {
                user.loaded && (
                    <PageLayout>
                        <PageTitle style={{margin: "20px 0"}}>{`Профиль пользователя ${user.login}`}</PageTitle>
                        <div className={styles.personInfoLabel}>
                            {
                                1 === 0 && auth.user && auth.user.isAdmin() && (
                                    <div className={styles.deleteButtonWrapper}>
                                        <Button onClick={async () => {
                                            if (await user.delete())
                                                history.push("/");
                                        }}>Удалить</Button>
                                    </div>
                                )
                            }
                            <table>
                                <tbody>
                                    <tr>
                                        <td className={styles.avatarContainer}>
                                            <div className={styles.avatar}>
                                                <img src={user.avatar} className={styles.avatarImage} />
                                            </div>
                                        </td>
                                        <td className={styles.infoContainer}>
                                            <div className={styles.info}>
                                                <div>Email: {user.email}</div>
                                                <div>Login: {user.login}</div>
                                                <div>ФИО: {user.surname == null ? "" : user.surname} {user.name == null ? "" : user.name} {user.patronymic == null ? "" : user.patronymic}</div>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {gamesStore.array().length > 0 && renderGames(gamesStore.array())}
                        {competencies.length > 0 && renderCompetencies(competencies)}

                    </PageLayout>
                )
            }

        </>
    );
}

export default observer(UserProfilePage);
