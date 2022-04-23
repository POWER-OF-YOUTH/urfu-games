import React, { useState } from "react";
import classNames from "classnames";
import { styled, TextField, Button } from "@mui/material";

import CompetenciesSelector from "../../components/CompetenciesSelector";
import ParticipantsSelector from "../../components/ParticipantsSelector";
import FileUploader from "./FileUploader";
import CoverUploader from "./CoverUploader";

import styles from "./GamePublishForm.module.css";

function GamePublishForm({ className, onSubmit = (f) => f, ...props }) {
    const [values, setValues] = useState({
        name: "",
        description: "",
        competencies: [],
        participants: [],
    });

    const handleSubmit = (evt) => {
        evt.preventDefault();

        onSubmit(values);
    };

    return (
        <form 
            className={classNames(className, styles.gamePublishForm)} 
            onSubmit={handleSubmit} 
            {...props}
        >
            <div className={classNames(styles.gamePublishForm__wrapper)}>
                <div className={classNames(styles.gamePublishForm__container)}>
                    <div className={classNames(styles.gamePublishForm__field)}>
                        <span className={classNames(styles.gamePublishForm__label)}>
                            Название
                        </span>
                        <TextField 
                            name="name" 
                            placeholder="Введите название" 
                        />
                    </div>
                    <div className={classNames(styles.gamePublishForm__field)}>
                        <span className={classNames(styles.gamePublishForm__label)}>
                            Описание
                        </span>
                        <TextField 
                            name="description" 
                            placeholder="Опишите игру" 
                            rows={6} 
                            multiline 
                        />
                    </div>
                    <div className={classNames(styles.gamePublishForm__field)}>
                        <span className={classNames(styles.gamePublishForm__label)}>
                            Компетенции
                        </span>
                        <CompetenciesSelector />
                    </div>
                    <div className={classNames(styles.gamePublishForm__field)}>
                        <span className={classNames(styles.gamePublishForm__label)}>
                            Участники/разработчики
                        </span>
                        <ParticipantsSelector />
                    </div>
                </div>
                <div className={classNames(styles.gamePublishForm__container)}>
                    <div className={classNames(styles.gamePublishForm__field)}>
                        <span className={classNames(styles.gamePublishForm__label)}>
                            Обложка
                        </span>
                        <CoverUploader />
                        <span className={classNames(styles.gamePublishForm__caption)}>
                            Загрузите обложку игры в соотношении 16x9.
                        </span>
                    </div>
                    <div className={classNames(styles.gamePublishForm__field)}>
                        <span className={classNames(styles.gamePublishForm__label)}>
                            Файлы
                        </span>
                        <FileUploader />
                        <span className={classNames(styles.gamePublishForm__caption)}>
                            Выберите ZIP архив, в котором содержится WebGL сборка игры.
                        </span>
                    </div>
                </div>
            </div>
            <div className={classNames(styles.publishButtonContainer)}>
                <PublishButton className={styles.publishButton} variant="contained" type="submit">
                    Опубликовать
                </PublishButton>
            </div>
        </form>
    );
}

const PublishButton = styled(Button)({
    backgroundColor: "#B0FF9D",
    color: "black",
    boxShadow: "none",
    "&:hover": {
        backgroundColor: "#B0FF9D",
        boxShadow: "none",
    },
});

export default GamePublishForm;
