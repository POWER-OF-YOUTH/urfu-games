import React, { useEffect, useState } from "react";
import Unity, { UnityContext } from "react-unity-webgl";
import { Button } from "@mui/material";
import { Helmet } from "react-helmet";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useParams, NavLink } from "react-router-dom";

import * as progressAPI from "../utils/api/progressAPI";
import Block from "../components/Block";
import { Game } from "../models/game";
import { useStore } from "../hooks";
import leftArrow from "../components/svg/leftArrow.svg";
import styles from "./PlayPage.module.css";
import NavMainButton from "../components/NavMainButton";
import NavButton from "../components/NavButton";
import Header from "../components/Header";

const defaultProgress = { data: "" };

function PlayPage() {
    const params = useParams(); // { gameId: string }

    const { auth } = useStore();

    const game = useLocalObservable(() => Game.create());

    const [unityContext, setUnityContext] = useState(null);
    const [gameDownloadingProgress, setGameDownloadingProgress] = useState(0);
    const [gameDownloaded, setGameDownloaded] = useState(false);
    const [progressLoaded, setProgressLoaded] = useState(false);

    useEffect(() => {
        game.load(params.gameId).catch(err => console.error(err));
    }, []);
    useEffect(() => {
        if (auth.checked && game.loaded) {
            if (auth.authenticated) {
                progressAPI.getProgress(game.id, auth.user.id)
                    .then((r) => r.json())
                    .then((json) => { 
                        window.userProgress = json.length > 0 ? json[0] : defaultProgress;
                        setProgressLoaded(true);
                    })
                    .catch((err) => console.error(err));
            }
            else {
                window.userProgress = defaultProgress;
                setProgressLoaded(true);
            }
        }
    }, [auth.checked, game.loaded]);
    useEffect(() => {
        if (game.loaded) {
            setUnityContext(new UnityContext({
                codeUrl: game.codeUrl,
                dataUrl: game.dataUrl,
                frameworkUrl: game.frameworkUrl,
                loaderUrl: game.loaderUrl
            }));
        }
    }, [game.loaded]);
    useEffect(() => {
        if (unityContext !== null) {
            // Internal events ----
            unityContext.on("progress", (progress) => {
                setGameDownloadingProgress(progress);
            });
            unityContext.on("loaded", () => {
                setGameDownloaded(true);
            });
            unityContext.on("error", (message) => console.error(message));
            // ---- Internal events

            // Custom events ----
            unityContext.on("saveProgress", (data) => {
                if (auth.authenticated) {
                    progressAPI.saveProgress(game.id, auth.user.id, data)
                        .catch(err => console.error(err));
                }
            });
            unityContext.on("loadProgress", () => {});
            // ---- Custom events

            return () => unityContext.removeAllEventListeners();
        }
    }, [unityContext]);
    return (
        <>
            <Helmet>
                <title>{game.loaded ? `${game.name} | Играть` : "Загурзка"}</title>
            </Helmet>
            <Header/>
            <main className={styles.content}>
                <NavButton className={styles.back} text={"назад"} href={`/games/${params.gameId}`}></NavButton>            
                <Block className={styles.gameBlock}>
                    {!gameDownloaded && (
                        <p>{`Загрузка ${Math.round(gameDownloadingProgress * 100)}%...`}</p>
                    )}
                    {(unityContext !== null && progressLoaded) && (
                        <Unity 
                            className={styles.gameCanvas} 
                            style={{ 
                                /* Не показываем игру пока все её файлы не загружены */
                                ...(!gameDownloaded ? { display: "none" } : {})
                            }}
                            unityContext={unityContext} 
                        /> 
                    )}
                </Block>
            </main>
        </>
    );
}

export default observer(PlayPage);
