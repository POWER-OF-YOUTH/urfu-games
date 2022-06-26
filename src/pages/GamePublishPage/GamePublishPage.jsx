import React from "react";
import { Helmet } from "react-helmet";
import classNames from "classnames";

import PageLayout from "../../layouts/PageLayout";
import PageTitle from "../../components/PageTitle";
import GamePublishForm from "./GamePublishForm";
import { APIURL, getDefaultRequestInit } from "../../helpers/apiConfig";

import styles from "./GamePublishPage.module.css";

function GamePublishPage({ history }) {
    const handleSubmit = async (values) => {
        values.participants = values.participants.map((p) => p.id);
        values.competencies = values.competencies.map((c) => c.id);

        const response = await fetch(`${APIURL}/games`, {
            method: "POST",
            ...getDefaultRequestInit(),
            body: JSON.stringify(values)
        });

        if (response.ok)
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
