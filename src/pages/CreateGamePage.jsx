import React from "react";
import { observer, useLocalObservable } from "mobx-react-lite";
import styles from "./CreateGamePage.module.css";

function GamesNewPage() {
    return (
        <div className={styles.container}>
            <div className={styles.gameCoverBlock}>
                <span className={styles.textCaption}>Обложка</span>
                <div className={styles.cover}></div>
            </div>
            <div className={styles.gameInfoBlock}>
                <div className={styles.gameNameBlock}>
                    <span className={styles.textCaption}>Название</span>
                    <div className={styles.gameName}></div>
                </div>
                <div className={styles.gameСompetenciesBlock}>
                    <span className={styles.textCaption}>Компетенции</span>
                    <div className={styles.competenciesSearch}></div>
                </div>
            </div>
            <div className={styles.descriptionBlock}>
                <span className={styles.textCaption}>Описание</span>
                <div className={styles.descriptionInput}></div>
            </div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    );
}

export default observer(GamesNewPage);
