import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Button } from "@mui/material";
import styled from "@emotion/styled";
import { observer, useLocalObservable } from "mobx-react-lite";
import { Helmet } from "react-helmet";

import PageLayout from "../layouts/PageLayout";
import PageTitle from "../components/PageTitle";
import GameCard from "../components/GameCard";
import { GamesStore } from "../models/game";

import styles from "./UnpublicatedGamesPage.module.css";
import { useStore } from "../hooks";
import Header from "../components/Header";

function UnpublicatedGamesPage() {
    const store = useStore();
    const games = useLocalObservable(() => GamesStore.create());

    useEffect(() => {
        games.load(0, 10, false).catch(err => console.error(err));
    }, []);

    return (
        <>
            <Helmet>
                <title>Неопубликованные игры</title>
            </Helmet>            
            <Header/>
            <PageLayout>
                <h2 className={styles.personTitle}>{"Неопубликованные игры"}</h2>
                <div className={styles.gamesWrapper}>
                    <div className={styles.gamesSection}>
                        <div className={styles.gamesGrid}>
                            {games.array().map((game, i) => <GameCard key={i} game={game} />)} 
                        </div>
                    </div>
                </div>
            </PageLayout>
        </>
    );
}

export default observer(UnpublicatedGamesPage);
