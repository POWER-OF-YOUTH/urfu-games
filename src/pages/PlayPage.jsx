import React, { useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import { Button } from "@mui/material";

import Header from "../components/Header";
import { fetchGame } from "../models/game";

import styles from "./PlayPage.module.css";

function PlayPage() {
    const { gameId } = useParams();

    const [game, setGame] = useState(null);

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
                    <NavLink className={styles.back} to={`/games/${gameId}`}>
                        <Button size="large">
                            Назад
                        </Button>
                    </NavLink>
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
