import React from "react";
import { Helmet } from "react-helmet";
import classNames from "classnames";

import PageLayout from "../../layouts/PageLayout";
import PageTitle from "../../components/PageTitle";
import GamePublishForm from "./GamePublishForm";
import Header from "../../components/Header";
import styles from "./GamePublishPage.module.css";

function GamePublishPage() {
    return (
        <>
            <Helmet>
                <title>Публикация игры</title>
            </Helmet>
            <Header/>
            <PageLayout>
                <PageTitle className={classNames(styles.title)}>Публикация игры</PageTitle>
                <GamePublishForm />
            </PageLayout>
        </>
    );
}

export default GamePublishPage;
