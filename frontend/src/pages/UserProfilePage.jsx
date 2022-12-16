import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Observer, observer, useLocalObservable } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import { User } from "../models/user";
import styles from "./UserProfilePage.module.css";
import PageLayout from "../layouts/PageLayout";
import Competence from "../components/Competence";
import CompetenciesList from "../components/CompetenciesList";
import { CompetenciesStore } from "../models/competence";

function UserProfilePage() {

    const { userId } = useParams();

    const user = useLocalObservable(() => User.create({ id: userId }));
    const competencies = useLocalObservable(() => CompetenciesStore.create());

    useEffect(() => { user.load(userId).catch(err => console.error(err)); }, []);
    useEffect(() => { competencies.seed(); }, []);

    return (
        <>
            <Helmet><title>{user.loaded ? "Профиль: " + user.login : "Загрузка"}</title></Helmet>
            {
                user.loaded && (
                    <PageLayout>
                        <div className={styles.personInfoLabel}>
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
                                        <CompetenciesList>
                                            {competencies.array().map(competence => <Competence key={competence.id} competence={competence} enablePopup={true}></Competence>)}
                                        </CompetenciesList>
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