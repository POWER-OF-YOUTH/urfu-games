import React, { useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
    Button,
    Rating
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { observer, useLocalObservable } from "mobx-react-lite";

import Header from "../components/Header";
import Block from "../components/Block";
import Competence from "../components/Competence";
import {
    CommentForm,
    CommentsListView
} from "../components/comments";
import { fetchGame } from "../models/game";
import { CompetenciesStore } from "../models/competence";
import { useStore } from "../hooks";

import styles from "./GamePage.module.css";

function GamePage({ history }) {
    const { gameId } = useParams();

    const { auth } = useStore();
    const competencies = useLocalObservable(() => CompetenciesStore.create());

    const [game, setGame] = useState(null);

    const handleCommentFormSubmit = (text) => game.comment(text); 
    const handleRatingChange = (evt, value) => game.rate(value);
    const handlePlayButtonClick = () => {
        window.ym(86784357, 'reachGoal', 'play_button_click');
    };
    const fetchAll = async () => {
        const game = await fetchGame(gameId);
        setGame(game);

        // Подгружаем компетенции привязанные к данной игре
        await Promise.all([
            game.comments.load(),
            ...game.competencies.map(c => competencies.loadOne(c))
        ]);
    };

    React.useEffect(() => {
        fetchAll(() => {}, () => history.push("/404"));
    }, []);
    return (
        <>
            { game ? 
                <>
                    <Helmet>
                        <title>{game.name}</title>
                    </Helmet>
                    <div className={styles.wrapper}>
                        <Block className={styles.paper}>
                            <div className={styles.contentWrapper}>
                                <div className={styles.content}>
                                    <div className={styles.topBlock}>
                                        <div className={styles.cover}>
                                            <img src={game.image} alt="cover" />
                                        </div>
                                        <div className={styles.gameData}>
                                            <p className={styles.name}>{game.name}</p>
                                            <div className={styles.details}>
                                                <p>
                                                    <span className={styles.caption}>Автор: </span>
                                                    <span className={styles.login}>{game.author.login}</span>
                                                </p>
                                                {game.participants.length > 0 ? 
                                                    <p>
                                                        <span className={styles.caption}>Участники: </span>
                                                        <span>
                                                            {game.participants.map(p => p.login).join(", ")}
                                                        </span>
                                                    </p>
                                                    :
                                                    <></>
                                                }
                                                <span className={styles.caption}>Компетенции: </span>
                                                <span className={styles.competencies}>
                                                    {competencies.all().map((c, i) => (
                                                        <Competence key={i} competence={c} enablePopup />
                                                    ))}
                                                </span> 
                                            </div> 
                                            <div className={styles.ratingContainer}>
                                                <Rating 
                                                    name="simple-controller" 
                                                    size="large" 
                                                    defaultValue={game.rating} 
                                                    onChange={handleRatingChange} 
                                                    readOnly={!auth.authenticated || game.rated}
                                                />
                                                <span className={styles.ratingCaption}>{game.rating}</span>
                                            </div>
                                            <div className={styles.gameButtonsContainer}>
                                                <NavLink 
                                                    className={styles.playButtonLink} 
                                                    to={`/games/${gameId}/play`}
                                                >
                                                    <Button className={styles.playButton} variant="contained" onClick={handlePlayButtonClick}>
                                                        Играть
                                                    </Button>
                                                </NavLink>
                                                { auth.authenticated && auth.user.id === game.author.id ? 
                                                    <NavLink 
                                                        className={styles.settingsButtonLink} 
                                                        to={`/games/${gameId}/settings`}
                                                    >
                                                        <Button className={styles.settingsButton} variant="contained">
                                                            <SettingsIcon />
                                                        </Button>
                                                    </NavLink>
                                                    : 
                                                    <></> 
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.descriptionBlock}>
                                        <p className={styles.blockCaption}>Описание</p>
                                        <div className={styles.descriptionContainer}>
                                            <span className={styles.description}>
                                                {game.description}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={styles.commentsBlock}>
                                        <p className={styles.blockCaption}>{`Комментарии (${game.comments.comments.size})`}</p>
                                        <div>
                                            {auth.authenticated ? <CommentForm onSubmit={handleCommentFormSubmit} /> : <></>}
                                            <CommentsListView comments={game.comments} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Block>
                    </div>
                </>
                : 
                <></> 
            }
        </>
    );
}

export default observer(GamePage);
