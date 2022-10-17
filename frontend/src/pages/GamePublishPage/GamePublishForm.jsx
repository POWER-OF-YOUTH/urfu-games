/**
 * @file Форма для публикации игры.
 */

import React from "react";
import classNames from "classnames";
import { styled, TextField, Button } from "@mui/material";

import CompetenciesSelector from "../../components/CompetenciesSelector";
import ParticipantsSelector from "../../components/ParticipantsSelector";
import CheckpointsMaker from "../../components/CheckpointsMaker";
import CoverUploader from "./CoverUploader";
import FileUploader from "./FileUploader";

import styles from "./GamePublishForm.module.css";

/**
 * Форма для публикации игры.
 */
class GamePublishForm extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
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
            newCompetenceDialogOpen: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.createChangeHandler.bind(this);
    }

    /**
     * Обработчик, который вызывается при нажатии на кнопку публикации.
     *
     * @param {Event} evt
     */
    handleSubmit(evt) {
        evt.preventDefault();

        this.props.onSubmit({...this.state});
    }

    /**
     * Создаёт обработчик, которые вызывается при изменении значения формы.
     *
     * @param name - название поля состояние, в которое будет записано новое значение.
     * @param f - функция, которая трансформирует значение перед записью в состояние.
     */
    createChangeHandler(name, f = (v) => v) {
        return (value) => {
            this.setState({
                [name]: f(value)
            });
        };
    }

    render() {
        const {className, newCompetenceDialogOpen} = this.props;
        const values = this.state;
        return (
            <form 
                className={classNames(className, styles.gamePublishForm)} 
                onSubmit={this.handleSubmit} 
                {...{props: this.props}}
            >
                <div className={classNames(styles.gamePublishForm__wrapper)}>
                    <div className={classNames(styles.gamePublishForm__column)}>
                        <GamePublishFormField label="Название">
                            <TextField 
                                placeholder="Введите название" 
                                onChange={this.createChangeHandler("name", (evt) => evt.target.value)}
                                required
                            />
                        </GamePublishFormField>

                        <GamePublishFormField label="Описание">
                            <TextField 
                                placeholder="Опишите игру" 
                                rows={6} 
                                onChange={this.createChangeHandler("description", (evt) => evt.target.value)}
                                multiline 
                                required
                            />
                        </GamePublishFormField>

                        <GamePublishFormField label="Компетенции">
                            <CompetenciesSelector
                                onChange={this.createChangeHandler("competencies", (evt) => evt.target.values)}
                                required
                            />
                        </GamePublishFormField>

                        <GamePublishFormField label="Участники/разработчики">
                            <ParticipantsSelector
                                onChange={this.createChangeHandler("participants", (evt) => evt.target.values)}
                                required
                            />
                        </GamePublishFormField>
                    </div>
                    <div className={classNames(styles.gamePublishForm__column)}>
                        <GamePublishFormField label="Обложка" caption="Загрузите обложку игры в соотношении 16x9.">
                            <CoverUploader
                                onFileLoad={this.createChangeHandler("image")}
                                required
                            />
                        </GamePublishFormField>

                        <GamePublishFormField label="*.loader.js">
                            <FileUploader
                                accept="application/javascript"
                                onFileLoad={this.createChangeHandler("loaderUrl")}
                                required
                            />
                        </GamePublishFormField>

                        <GamePublishFormField label="*.framework.js">
                            <FileUploader 
                                accept="application/javascript"
                                onFileLoad={this.createChangeHandler("frameworkUrl")}
                                required
                            />
                        </GamePublishFormField>

                        <GamePublishFormField label="*.wasm">
                            <FileUploader 
                                accept="application/wasm"
                                onFileLoad={this.createChangeHandler("codeUrl")}
                                required
                            />
                        </GamePublishFormField>
                        
                        <GamePublishFormField label="*.data">
                            <FileUploader
                                onFileLoad={this.createChangeHandler("dataUrl")}
                                required
                            />
                        </GamePublishFormField>
                    </div>

                    <GamePublishFormField className={styles.gamePublishForm__field_checkpoints} label="Чекпоинты">
                        <CheckpointsMaker 
                            className={classNames(styles.checkpointsMaker)}
                            name="checkpoints"
                            competencies={values.competencies}
                            onChange={this.createChangeHandler("checkpoints", (evt) => evt.target.values)}
                        />
                    </GamePublishFormField>
                </div>

                <div className={classNames(styles.publishButtonContainer)}>
                    <PublishButton className={styles.publishButton} variant="contained" type="submit">
                        Опубликовать
                    </PublishButton>
                </div>
            </form>
        );
    }
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