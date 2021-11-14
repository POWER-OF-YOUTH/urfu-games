import React from "react";
import { Helmet } from "react-helmet";

import styles from "./NotFoundPage.module.css";

function NotFoundPage() {
    return (
        <>
            <Helmet>
                <title>404</title>
            </Helmet>
            <main className={styles.content}>
                <p className={styles.errorCode}>404</p>
                <p className={styles.errorMessage}>Запрашиваемая страница не найдена</p>
            </main>
        </>
    );
}

export default NotFoundPage;
