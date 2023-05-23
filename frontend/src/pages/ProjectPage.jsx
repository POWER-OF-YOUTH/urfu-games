import React, { useCallback, useEffect } from "react";
import PageTitle from "../components/PageTitle";
import { Helmet } from "react-helmet";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import { User } from "../models/user";
import { useStore } from "../hooks";
import styles from "./ProjectPage.module.css";
import PageLayout from "../layouts/PageLayout";
import GameCard from "../components/GameCard";
import Competence from "../components/Competence";
import { Button } from "@mui/material";
import PhotoProfile from "../components/images/BigPhotoProfile.png";
import NavMainButton from "../components/NavMainButton";
import NavButton from "../components/NavButton";
import { CompetenciesStore } from "../models/competence";
import { GamesStore } from "../models/game";
import Block from "../components/Block";

function ProjectPage({ history }) {
    const store = useStore();
    const games = useLocalObservable(() => GamesStore.create());
    const competencies = useLocalObservable(() => CompetenciesStore.create());

    useEffect(() => {
        games.load().catch(err => console.error(err));
        competencies.load().catch(err => console.error(err));
    }, []);

    // Библиотека
    return (
        <>
            <Helmet>
                <title></title>
            </Helmet>
            <PageLayout>
                <h2 className={styles.personTitle}>{"Мои проекты"}</h2>
                {/* <div className={styles.gamesGrid}>
                    {games.array().map((game, i) => <GameCard key={i} game={game} />)} 
                </div> */}
                <div  className={styles.gamesGrid}>
                    {games.array().map((game, i) => <GameCard key={i} game={game} />)} 
                </div>
            </PageLayout>
            <Block className={styles.content}>

            </Block>
            {/* <div className={styles.gamesGrid}>
                {games.array().map((game, i) => <GameCard key={i} game={game} className={styles.gamesSyle} />)} 
            </div> */}
        </>
    );
}

export default observer(ProjectPage);
