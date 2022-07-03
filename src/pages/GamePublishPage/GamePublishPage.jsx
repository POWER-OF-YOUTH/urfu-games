import React from "react";
import { Helmet } from "react-helmet";
import classNames from "classnames";

import PageLayout from "../../layouts/PageLayout";
import PageTitle from "../../components/PageTitle";
import GamePublishForm from "./GamePublishForm";
import * as gamesAPI from "../../utils/api/gamesAPI";

import styles from "./GamePublishPage.module.css";

function GamePublishPage({ history }) {
    const handleSubmit = async (data) => {
        data.participants = data.participants.map((p) => p.id);
        data.competencies = data.competencies.map((c) => c.id);

        await gamesAPI.addGame(data);

        history.push("/");
    };

    return (
        <>
            <Helmet>
                <title>Публикация игры</title>
            </Helmet>
            <PageLayout>
                <PageTitle className={classNames(styles.title)}>Публикация игры</PageTitle>
                <GamePublishForm onSubmit={handleSubmit} />
            </PageLayout>
        </>
    );
}

export default GamePublishPage;
