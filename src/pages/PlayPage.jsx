import React, { useState } from "react";
import { useParams } from "react-router-dom";

import Header from "../components/Header";
import { fetchGame } from "../models/game";
import { useStore } from "../hooks";

import styles from "./PlayPage.module.css";

function PlayPage({ history }) {
    const { gameId } = useParams();

    const [game, setGame] = useState(null);

    const { auth } = useStore();

    const fetchAll = async () => {
        const game = await fetchGame(gameId);

        setGame(game);
    };

    React.useEffect(() => {
        fetchAll().then(() => {}, () => console.log("Something bad happens"));
    }, []);
    return (
        <>
            <Header />
            <div className={styles.wrapper}>
                <main className={styles.content}>
                    { game ?  
                        <>
                            <div className={styles.gameContainer}>
                                <iframe 
                                    className={styles.gameFrame}
                                    src={game.url} 
                                    frameBorder="no"
                                >
                                    Браузер не поддерживает iframe
                                </iframe>
                            </div>
                        </>
                        :
                        <></>
                    }
                </main>
            </div>
        </>
    );
}

export default PlayPage;
