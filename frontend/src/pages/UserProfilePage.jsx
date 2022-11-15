import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Observer, observer, useLocalObservable } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import { User } from "../models/user";
import styles from "./UserProfilePage.module.css";
import PageLayout from "../layouts/PageLayout";

function UserProfilePage() {

    const { userId } = useParams();

    const user = useLocalObservable(() => User.create({ id: userId }));

    useEffect(() => { user.load(userId).catch(err => console.error(err)); }, []);

    return (
        <>
            <Helmet><title>{user.loaded ? "Профиль: " + user.login : "Загрузка"}</title></Helmet>
            {
                user.loaded && (
                    <>
                        <PageLayout>
                            <img src={user.avatar} className={styles.avatarImage} />
                            <div>Email: {user.email}</div>
                            <div>Login: {user.login}</div>
                            <div>Name: {user.name == null ? "Не указано" : user.name}</div>
                            <div>Patronymic: {user.patronymic == null ? "Не указано" : user.patronymic}</div>
                            <div>Surname: {user.surname == null ? "Не указано" : user.surname}</div>
                        </PageLayout>
                    </>
                )
            }

        </>
    );
}

export default observer(UserProfilePage);