import React, { 
    useState,
    useContext
} from "react";
import { useParams } from "react-router-dom";
import {
    Button,
    Rating
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { NavLink } from "react-router-dom";
import { observer, useLocalObservable } from "mobx-react-lite";
import { Helmet } from "react-helmet";

import Header from "../components/Header";
import {
    CommentForm,
    CommentsListView
} from "../components/comments";
import Competence from "../components/Competence";
import { Game } from "../models/game";
import { CommentsStore } from "../models/comment";
import { RootStoreContext } from "../models/root";
import * as gamesAPI from "../utils/api/gamesAPI";

import styles from "./GamePage.module.css";


function GamePage({ history }) {
    const params = useParams(); // { gameId: string }

    const rootStore = useContext(RootStoreContext);
    const authStore = rootStore.authStore;
    const commentsStore = useLocalObservable(() => 
        CommentsStore.create({ gameId: params.gameId })
    );
    let [game, setGame] = useState(null);

    const fetchGame = async (gameId) => {
        const response = await gamesAPI.getGame(gameId);

        if (response.ok) {
            const gameData = await response.json();
            setGame(Game.create(gameData));
        }
        else
            return Promise.reject();
    };
    const fetchComments = (gameId) => commentsStore.loadComments();
    const fetchAll = async (gameId) => {
        await Promise.all([
            fetchGame(gameId),
            fetchComments(gameId)
        ]);
    };

    const handleCommentFormSubmit = (text) => commentsStore.addComment(text); 
    const handleRatingChange = (evt, value) => game.rate(value);

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

    React.useEffect(() => {
        fetchAll(params.gameId).then(() => {}, () => history.push("/404")); // Если игра не найдена, переадресуем на страницу ошибки
    }, []);
    return (
        <>
            <Header />
            { game ? 
                <>
                    <Helmet>
                        <title>{game.name}</title>
                    </Helmet>
                    <div className={styles.wrapper}>
                        <div className={styles.paper}>
                            <div className={styles.contentWrapper}>
                                <main className={styles.content}>
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
                                                    {competencies}
                                                </span> 
                                            </div> 
                                            <div className={styles.ratingContainer}>
                                                <Rating 
                                                    name="simple-controller" 
                                                    size="large" 
                                                    defaultValue={game.rating} 
                                                    onChange={handleRatingChange} 
                                                />
                                                <span className={styles.ratingCaption}>{game.rating}</span>
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
                                                { authStore.authenticated && authStore.user.id === game.author.id ? 
                                                    <NavLink 
                                                        className={styles.settingsButtonLink} 
                                                        to={`/games/${params.gameId}/settings`}
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
                                        <p className={styles.blockCaption}>{`Комментарии (${commentsStore.comments.size})`}</p>
                                        <div>
                                            {authStore.authenticated ? <CommentForm onSubmit={handleCommentFormSubmit} /> : <></>}
                                            <CommentsListView store={commentsStore} />
                                        </div>
                                    </div>
                                </main>
                            </div>
                        </div>
                    </div>
                </>
                : 
                <></> 
            }
        </>
    );
}

export default observer(GamePage);
