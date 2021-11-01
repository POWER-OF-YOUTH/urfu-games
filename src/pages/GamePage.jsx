import React, { useState } from "react";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { 
    Button, 
    Rating
} from "@material-ui/core";
import SettingsIcon from "@material-ui/icons/Settings";
import { NavLink } from "react-router-dom";

import { CommentsStore } from "../models/comment";
import { observer, useLocalObservable } from "mobx-react-lite";
import { 
    CommentForm, 
    CommentsList,
    Comment
} from "../components/comments";
import CommentsListView from "../components/comments/CommentsListView";
import Competence from "../components/Competence";
import Header from "../components/Header";
import styles from "./GamePage.module.css";

const propTypes = { // TODO:

};

const defaultProps = { // TODO:

};

function GamePage({ history, ...props }) {
    const params = useParams();

    const commentsStore = useLocalObservable(() => 
        CommentsStore.create({ gameId: params.gameId })
    );

    // Вызвается при нажатии кнопки «Отправить» компонента CommentForm
    const handleSendClick = (text) => { commentsStore.addComment(text); };

    const competencies = [ 
        {
            name: "Математика"
        },
        {
            name: "Физика",
            color: "purple"
        },
        {
            name: "Химия",
            color: "darkred"
        }
    ].map((competence, i) => (
        <Competence key={i} color={competence.color}>{competence.name}</Competence>
    )); 
    return (
        <>
            <Header />
            <div className={styles.wrapper}>
                <div className={styles.contentWrapper}>
                    <main className={styles.content}>
                        <div className={styles.topBlock}>
                            <div className={styles.cover}>
                                <img src="https://cdn2.unrealengine.com/Diesel%2Fproduct%2Fmint%2Fhome%2FGhostbustersRemastered_GamePagePromo-1920x1080-60c14b012afd9440f08a5d7e91fa11101df91630.jpg?h=720&resize=1&w=1280"/>
                            </div>
                            <div className={styles.gameData}>
                                <p className={styles.name}>#Название</p>
                                <div className={styles.details}>
                                    <p>
                                        <span className={styles.caption}>Автор: </span>
                                        <span className={styles.login}>#Логин</span>
                                    </p>
                                    <p>
                                        <span className={styles.caption}>Участники: </span>
                                        <span>#Участник1, #Участник2</span>
                                    </p>
                                    <span className={styles.caption}>Компетенции: </span>
                                    <span className={styles.competencies}>
                                        { competencies }
                                    </span> 
                                </div> 
                                <div className={styles.ratingContainer}>
                                    <Rating name="simple-controller" size="large" defaultValue={4} />
                                    <span className={styles.ratingCaption}>4.5</span>
                                </div>
                                <div className={styles.gameButtonsContainer}>
                                    <NavLink 
                                        className={styles.playButtonLink} 
                                        to={`/games/${params.gameId}/play`}
                                    >
                                        <Button className={styles.playButton} variant="contained">
                                            Играть
                                        </Button>
                                    </NavLink>
                                    <NavLink 
                                        className={styles.settingsButtonLink} 
                                        to={`/games/${params.gameId}/settings`}
                                    >
                                        <Button className={styles.settingsButton} variant="contained">
                                            <SettingsIcon />
                                        </Button>
                                    </NavLink>
                                </div>
                            </div>
                        </div>
                        <div className={styles.descriptionBlock}>
                            <p className={styles.blockCaption}>Описание</p>
                            <div className={styles.descriptionContainer}>
                                <span className={styles.description}>
                                    Снова надень свой протонный ранец и присоединись к Охотникам за приведениями в их приключениях с голосами и внешностью оригинальной команды в битве за спасение Нью-Йорка!
                                    <br/>
                                    <br/>
                                    Настоящие Охотники за приведениями - В игре, написанной авторами оригинальных фильмов - Дэном Эйкройдом и Гарольдом Рэмисом, вы услышите и узнаете Билла Мюррея, Дэна Эйкройда, Гарольда Рэмиса и Эрни Хадсона.
                                    <br/>
                                    <br/>
                                    Уникальный геймплей - Испытайте уникальную охоту на призраков, борьбу и их поимку с улучшаемым оружием в разрушаемом окружении. Проверьте силу вашей команды в масштабных битвах с боссами.
                                    <br/>
                                    <br/>
                                    Сюжетная Кампания - Проходи уникальную сюжетную линию, сражаясь и захватывая призраков - как хорошо-знакомых и любимых, так и совершенно новых - по всему Нью-Йорку.
                                </span>
                            </div>
                        </div>
                        <div className={styles.commentsBlock}>
                            <p className={styles.blockCaption}>Комментарии</p>
                            <div>
                                <CommentForm onSubmit={handleSendClick} />
                                <CommentsListView store={commentsStore} />
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}

GamePage.propTypes = propTypes;
GamePage.defaultProps = defaultProps;

export default observer(GamePage);
