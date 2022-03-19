import React, { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Button } from "@mui/material";
import { observer, useLocalObservable } from "mobx-react-lite";
import Unity, { UnityContext } from "react-unity-webgl";

import Block from "../components/Block";
import { Game } from "../models/game";

import styles from "./PlayPage.module.css";

function PlayPage() {
    const params = useParams(); // { gameId: string }

    const game = useLocalObservable(() => Game.create());

    const [unityContext, setUnityContext] = useState(null);
    const [gameDownloadingProgress, setGameDownloadingProgress] = useState(0);
    const [gameDownloaded, setGameDownloaded] = useState(false);

    useEffect(() => {
        game.load(params.gameId).catch(err => console.error(err));
    }, []);
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
            unityContext.on("progress", (progress) => {
                setGameDownloadingProgress(progress);
            });
            unityContext.on("loaded", () => {
                setGameDownloaded(true);
            });
        }
    }, [unityContext]);
    return (
        <>
            <Helmet>
                <title>{game.loaded ? `${game.name} | Играть` : "Загурзка"}</title>
            </Helmet>
            <main className={styles.content}>
                <NavLink className={styles.back} to={`/games/${params.gameId}`}>
                    <Button size="large">
                        Назад
                    </Button>
                </NavLink>
                <Block className={styles.gameBlock}>
                    {!gameDownloaded && (
                        <p>{`Загрузка ${Math.round(gameDownloadingProgress * 100)}%...`}</p>
                    )}
                    {unityContext !== null && (
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
