/**
 * @file Форма для публикации игры.
 */

import React, { useState } from "react";
import classNames from "classnames";
import styled from "@emotion/styled";
import { TextField, Button } from "@mui/material";
import { useHistory } from "react-router-dom";

import CheckpointsMaker from "../../components/CheckpointsMaker";
import CompetenciesSelector from "../../components/CompetenciesSelector";
import CoverUploader from "./CoverUploader";
import FileUploader from "./FileUploader";
import ParticipantsSelector from "../../components/ParticipantsSelector";

import * as gamesAPI from "../../utils/api/gamesAPI";

import styles from "./GamePublishForm.module.css";

/**
 * Форма для публикации игры.
 */
function GamePublishForm({className, ...props}) {
    const history = useHistory();
    const [values, setValues] = useState({
        name: "",
        description: "",
        competencies: [],
        participants: [],
        image: "",
        checkpoints: [],
        loaderUrl: "",
        frameworkUrl: "",
        codeUrl: "",
        dataUrl: "",
    });

    /**
     * Обработчик, который вызывается при нажатии на кнопку публикации.
     *
     * @param {Event} evt
     */
    const handleSubmit = async (evt) => {
        evt.preventDefault();

        const data = {...values};
        data.competencies = data.competencies.map((c) => c.id);
        data.checkpoints.forEach((c) => c.competence = c.competence != null ? c.competence.id : undefined);

        await gamesAPI.addGame(data);

        history.push("/");
    };

    /**
     * Создаёт обработчик, которые вызывается при изменении значения формы.
     *
     * @param name название поля состояние, в которое будет записано новое значение.
     * @param t функция, которая трансформирует значение перед записью в состояние.
     */
    const createChangeHandler = (name, t = (v) => v) => {
        return (value) => {
            setValues({...values, [name]: t(value)});
        };
    };

    return (
        <form
            className={classNames(className, styles.gamePublishForm)}
            onSubmit={handleSubmit}
            {...props}
        >
            <div className={classNames(styles.gamePublishForm__wrapper)}>
                <div className={classNames(styles.gamePublishForm__column)}>
                    <GamePublishFormField label="Название">
                        <TextField
                            placeholder="Введите название"
                            onChange={createChangeHandler("name", (evt) => evt.target.value)}
                            required
                        />
                    </GamePublishFormField>

                    <GamePublishFormField label="Описание">
                        <TextField
                            placeholder="Опишите игру"
                            rows={6}
                            onChange={createChangeHandler("description", (evt) => evt.target.value)}
                            multiline
                            required
                        />
                    </GamePublishFormField>

                    <GamePublishFormField label="Компетенции">
                        <CompetenciesSelector
                            onChange={createChangeHandler("competencies", (evt) => evt.target.values)}
                            required
                        />
                    </GamePublishFormField>

                    <GamePublishFormField label="Участники/разработчики">
                        <ParticipantsSelector
                            onChange={createChangeHandler("participants", (evt) => evt.target.values)}
                            required
                        />
                    </GamePublishFormField>
                </div>
                <div className={classNames(styles.gamePublishForm__column)}>
                    <GamePublishFormField label="Обложка" caption="Загрузите обложку игры в соотношении 16x9.">
                        <CoverUploader
                            onFileLoad={createChangeHandler("image")}
                            required
                        />
                    </GamePublishFormField>

                    <GamePublishFormField label="*.loader.js">
                        <FileUploader
                            accept="application/javascript"
                            onFileLoad={createChangeHandler("loaderUrl")}
                            required
                        />
                    </GamePublishFormField>

                    <GamePublishFormField label="*.framework.js">
                        <FileUploader
                            accept="application/javascript"
                            onFileLoad={createChangeHandler("frameworkUrl")}
                            required
                        />
                    </GamePublishFormField>

                    <GamePublishFormField label="*.wasm">
                        <FileUploader
                            accept="application/wasm"
                            onFileLoad={createChangeHandler("codeUrl")}
                            required
                        />
                    </GamePublishFormField>

                    <GamePublishFormField label="*.data">
                        <FileUploader
                            onFileLoad={createChangeHandler("dataUrl")}
                            required
                        />
                    </GamePublishFormField>
                </div>

                {
                /*
                    <GamePublishFormField className={styles.gamePublishForm__field_checkpoints} label="Чекпоинты">
                        <CheckpointsMaker
                            className={classNames(styles.checkpointsMaker)}
                            name="checkpoints"
                            competencies={values.competencies}
                            onChange={(checkpoints) => setValues({...values, checkpoints })}
                        />
                    </GamePublishFormField>
                */
                }
            </div>

            <div className={classNames(styles.publishButtonContainer)}>
                <PublishButton className={styles.publishButton} variant="contained" type="submit">
                    Опубликовать
                </PublishButton>
            </div>
        </form>
    );
}

/**
 * Поле формы GamePublishForm.
 */
function GamePublishFormField({
    className,
    label,
    caption,
    children,
    ...props
}) {
    return (
        <div className={classNames(className, styles.gamePublishForm__field)} {...props}>
            <span className={classNames(styles.gamePublishForm__label)}>
                {label}
            </span>
            {children}
            {caption && (
                <span className={classNames(styles.gamePublishForm__caption)}>
                    Загрузите обложку игры в соотношении 16x9.
                </span>
            )}
        </div>
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
