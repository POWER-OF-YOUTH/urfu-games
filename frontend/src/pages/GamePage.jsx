import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { observer, useLocalObservable } from "mobx-react-lite";
import { NavLink, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Button, Rating } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";

import Block from "../components/Block";
import Competence from "../components/Competence";
import { CommentForm, CommentsListView } from "../components/comments";
import { Game } from "../models/game";
import { useStore } from "../hooks";
import * as globals from "../globals";
import Star from "../components/svg/Star.svg";
import BlackStar from "../components/svg/BlackStar.svg";
import styles from "./GamePage.module.css";
import CompetenciesList from "../components/CompetenciesList";
import NavButton from "../components/NavButton";
import NavMainButton from "../components/NavMainButton";
import NavDeleteButton from "../components/NavDeleteButton";
import PhotoProfile from "../components/images/PhotoProfile.png";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { AspectRatio } from 'react-aspect-ratio';
import Header from "../components/Header";



function GamePage({ history }) {
    const CorodedStar = (props) => {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width={20} height={18} fill="none" {...props}>
                <path
                    fill="#0463EA"
                    d="M7.003 2.224c.943-2.903 5.05-2.903 5.994 0A3.151 3.151 0 0 0 15.994 4.4c3.053 0 4.322 3.907 1.852 5.7a3.151 3.151 0 0 0-1.145 3.524c.944 2.903-2.38 5.317-4.849 3.523a3.151 3.151 0 0 0-3.704 0c-2.47 1.794-5.793-.62-4.85-3.523a3.151 3.151 0 0 0-1.144-3.523c-2.47-1.794-1.2-5.7 1.852-5.7 1.365 0 2.575-.88 2.997-2.178Z"
                />
            </svg>
        );
    };

    const StarIcon = (props) => {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width={20} height={18} fill="none" {...props}>
                <path
                    fill="#D9D9D9"
                    d="M7.003 2.224c.943-2.903 5.05-2.903 5.994 0A3.151 3.151 0 0 0 15.994 4.4c3.053 0 4.322 3.907 1.852 5.7a3.151 3.151 0 0 0-1.145 3.524c.944 2.903-2.38 5.317-4.849 3.523a3.151 3.151 0 0 0-3.704 0c-2.47 1.794-5.793-.62-4.85-3.523a3.151 3.151 0 0 0-1.144-3.523c-2.47-1.794-1.2-5.7 1.852-5.7 1.365 0 2.575-.88 2.997-2.178Z"
                />
            </svg>
        );
    };

    const StyledRating = styled(Rating)({
        "& .MuiRating-iconFilled": {
            color: "#ff6d75",
        },
        "& .MuiRating-iconHover": {
            color: "#ff3d47",
        },
    });

    const params = useParams(); // { gameId: string }

    const { auth } = useStore();

    const game = useLocalObservable(() => Game.create());

    const handleCommentFormSubmit = (text) => game.comment(text);
    const handleRatingChange = (evt, value) => game.rate(value);
    const handlePlayButtonClick = () => {
        if (process.env.NODE_ENV !== undefined && process.env.NODE_ENV !== "development") {
            window.ym(globals.YM_ID, "reachGoal", "play_button_click");
        }
    };
    const handlePublishButtonClick = () => {
        game.publish()
            .then(() => history.push("/"))
            .catch((err) => console.error(err));
    };
    const handleDeleteButtonClick = () => {
        game.delete()
            .then(() => history.push("/"))
            .catch((err) => console.error(err));
    };

    useEffect(() => {
        game.load(params.gameId).catch((err) => {
            if (err.response.status == 404) history.push("/404");
            else {
                console.error(err);
                history.push("/");
            }
        });
    }, []);
    useEffect(() => {
        if (game.loaded) game.loadComments().catch((err) => console.error(err));
    }, [game.loaded]);
    return (
        <>
            <Helmet>
                <title>{game.loaded ? game.name : "Загрузка"}</title>
            </Helmet>
            <Header/>
            <div className={styles.pageGrid}>
                <div className={styles.sideBar}>
                    <span className={styles.titleText}>Навигация</span>
                    <CompetenciesList className={styles.competenciesList}></CompetenciesList>
                </div>
                {game.loaded && (
                    <>
                        <div>
                            <Block className={styles.content}>
                                <div className={styles.content}>
                                    <div className={styles.contentWrapper}>
                                        <div className={styles.content}>
                                            <div className={styles.topBlock}>
                                                <div className={styles.cover}>
                                                    <div className={styles.gameTitle}>
                                                        <p className={styles.name}>{game.name}</p>
                                                    </div>
                                                    <AspectRatio ratio="16/9" > 
                                                        <img src={game.image}/>
                                                    </AspectRatio>                                                    
                                                </div>
                                                <div className={styles.gameData}>
                                                    <div className={styles.gameContainer}>
                                                        <div className={styles.ratingContainer}>
                                                            <StyledRating
                                                                name="customized-color"
                                                                defaultValue={0}
                                                                getLabelText={(value) =>
                                                                    `${value} Heart${value !== 1 ? "s" : ""}`
                                                                }
                                                                precision={1}
                                                                icon={<CorodedStar fontSize="inherit" />}
                                                                emptyIcon={<StarIcon fontSize="inherit" />}
                                                                onChange={handleRatingChange}
                                                                readOnly={!auth.authenticated}
                                                            />
                                                        </div>
                                                        <div className={styles.blockProfile}>
                                                            <img src={PhotoProfile} alt="cover" />
                                                        </div>
                                                        {game.participants.length > 0 && (
                                                            <div>
                                                                <span className={styles.blockSubtitile}>
                                                                    Имя разработчиков:{" "}
                                                                </span>
                                                                <span>
                                                                    {game.participants.map((p, i) => (
                                                                        <>
                                                                            <ParticipantLink
                                                                                key={i}
                                                                                to={`/users/${p.id}`}
                                                                            >
                                                                                {p.login}
                                                                            </ParticipantLink>
                                                                            {i < game.participants.length - 1 && (
                                                                                <span>{", "}</span>
                                                                            )}
                                                                        </>
                                                                    ))}
                                                                </span>
                                                            </div>
                                                        )}
                                                        {auth.authenticated && auth.user.isModerator() && (
                                                            <div>
                                                                <NavDeleteButton
                                                                    className={styles.button}
                                                                    text={"Скрыть игру"}
                                                                    href={"/signin"}
                                                                ></NavDeleteButton>
                                                            </div>
                                                        )}
                                                        {auth.authenticated && auth.user.isModerator() && (
                                                            <div>
                                                                <NavDeleteButton
                                                                    className={styles.button}
                                                                    text={"Удалить игру"}
                                                                    href={"/signin"}
                                                                    onClick={handleDeleteButtonClick}
                                                                ></NavDeleteButton>
                                                            </div>
                                                        )}
                                                        <div>
                                                            <div>
                                                                <NavMainButton
                                                                    className={styles.gamebutton}
                                                                    text={"Играть"}
                                                                    href={`/games/${params.gameId}/play`}
                                                                ></NavMainButton>
                                                            </div>
                                                        </div>
                                                        {auth.authenticated && (
                                                            <div >
                                                                <NavButton         
                                                                    className={styles.addButton}                                                           
                                                                    text={"Добавить к команде"}
                                                                    href={"/signin"}
                                                                ></NavButton>
                                                            </div>
                                                        )}
                                                        <div>
                                                            {/* className={styles.gameButtonsContainer} */}
                                                            {!game.isPublicated &&
                                                                auth.authenticated &&
                                                                auth.user.isAdmin() && (
                                                                <NavMainButton
                                                                    className={styles.gamebutton}
                                                                    text={"Одобрить публикацию"}                                                                
                                                                    onClick={handlePublishButtonClick}
                                                                ></NavMainButton>
                                                            )}                                                           
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={styles.descriptionBlock}>
                                                <span className={styles.caption}>Компетенции: </span>
                                                <span className={styles.competencies}>
                                                    {game.competencies.map((c, i) => ( 
                                                        <Competence key={i} competence={c} enablePopup />
                                                    ))}
                                                </span>
                                                <p className={styles.blockSubtitile}>Описание</p>
                                                <div className={styles.descriptionContainer}>
                                                    <span className={styles.description}>{game.description}</span>
                                                </div>
                                            </div>
                                            <div className={styles.commentsBlock}>
                                                <p className={styles.blockSubtitile}>
                                                    {`Комментарии (${game.comments.size})`}
                                                </p>
                                                <div>
                                                    {auth.authenticated && (
                                                        <CommentForm onSubmit={handleCommentFormSubmit} />
                                                    )}
                                                    <CommentsListView store={game.comments} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Block>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

const ParticipantLink = styled(NavLink)({
    textDecoration: "none",
    color: "black",
    "&:hover": {
        textDecoration: "underline",
    },
});

const PublishButton = styled(Button)({
    backgroundColor: "green",
});

const DeleteButton = styled(Button)({
    backgroundColor: "#8a2424",
    "&:hover": {
        backgroundColor: "#8a2424",
    },
});

export default observer(GamePage);
