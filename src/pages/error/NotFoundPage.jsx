import React from "react";
import { NavLink } from "react-router-dom";
import { Helmet } from "react-helmet";

import Header from "../../components/Header";

import styles from "./NotFoundPage.module.css";

function NotFoundPage() {
    return (
        <>
            <Helmet>
                <title>404</title>
            </Helmet>
            <Header />
            <main className={styles.content}>
                <p className={styles.errorCode}>404</p>
                <p className={styles.errorMessage}>Запрашиваемая страница не найдена</p>
                <NavLink className={styles.goToMain} to="/">Вернуться на главную</NavLink>
            </main>
        </>
    );
}

export default NotFoundPage;
