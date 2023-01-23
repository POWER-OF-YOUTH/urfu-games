import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import { User } from "../models/user";
import { useStore } from "../hooks";
import styles from "./UserProfilePage.module.css";
import PageLayout from "../layouts/PageLayout";
import Competence from "../components/Competence";
import { Button } from "@mui/material";

function UserProfilePage({ history }) {

    const { userId } = useParams();
    const { auth } = useStore();

    const user = useLocalObservable(() => User.create({ id: userId }));

    useEffect(() => { user.load(userId).catch(err => console.error(err)); }, []);
    const competencies = [
        {
            id: "0",
            name: "Логистика",
            description: "Не одной факторией единой"
        },
        {
            id: "1",
            name: "Теория вероятности",
            description: "Какова вероятность того, что это прочитают"
        },
        {
            id: "2",
            name: "Английский язык",
            description: "На английском знаю только sprechen sie deutsch"
        },
        {
            id: "3",
            name: "Высшая математика",
            description: "А где низшая?"
        },
        {
            id: "4",
            name: "Квантовая механика",
            description: "А может и не механика"
        }
    ];

    return (
        <>
            <Helmet><title>{user.loaded ? "Профиль: " + user.login : "Загрузка"}</title></Helmet>
            {
                user.loaded && (
                    <PageLayout>
                        <div className={styles.personInfoLabel}>
                            {
                                auth?.user.isAdmin() && (
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

                        <table className={styles.createdAndCompetenceTable}>
                            <tbody>
                                <tr>
                                    <td className={styles.cContainer}>

                                    </td>
                                    <td className={styles.cContainer}>
                                        <div className={styles.cTitle}>
                                            <h2>Компетенции</h2>
                                        </div>
                                        <div className={styles.cWrapper}>
                                            {competencies.map(competence => <Competence key={competence.id} competence={competence} enablePopup={true}></Competence>)}
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                    </PageLayout>
                )
            }

        </>
    );
}

export default observer(UserProfilePage);