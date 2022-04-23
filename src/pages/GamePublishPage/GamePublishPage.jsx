import React from "react";
import classNames from "classnames";

import PageLayout from "../../layouts/PageLayout";
import PageTitle from "../../components/PageTitle";
import GamePublishForm from "./GamePublishForm";

import styles from "./GamePublishPage.module.css";

function CreateGamePage() {
    const handleSubmit = (values) => {
        console.log(values);
    };

    return (
        <PageLayout>
            <PageTitle className={classNames(styles.title)}>
                Публикация игры
            </PageTitle>
            <GamePublishForm onSubmit={handleSubmit} />
        </PageLayout>
    );
}

export default CreateGamePage;
