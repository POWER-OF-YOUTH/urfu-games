import React from "react";
import { Helmet } from "react-helmet";
import classNames from "classnames";

import PageLayout from "../../layouts/PageLayout";
import PageTitle from "../../components/PageTitle";
import GamePublishForm from "./GamePublishForm";

import styles from "./GamePublishPage.module.css";

function GamePublishPage() {
    const handleSubmit = (values) => {
        console.log(values);
    };

    return (
        <>
            <Helmet>
                <title>Публикация игры</title>
            </Helmet>
            <PageLayout>
                <PageTitle className={classNames(styles.title)}>
                    Публикация игры
                </PageTitle>
                <GamePublishForm onSubmit={handleSubmit} />
            </PageLayout>
        </>
    );
}

export default GamePublishPage;
