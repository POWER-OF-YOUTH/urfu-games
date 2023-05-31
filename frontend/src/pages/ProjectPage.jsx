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
import { GamesStore } from "../models/game";
import { Button } from "@mui/material";
import PhotoProfile from "../components/images/BigPhotoProfile.png";
import NavMainButton from "../components/NavMainButton";
import NavButton from "../components/NavButton";
import Header from "../components/Header";


function ProjectPage({ history }) {

    const { userId } = useParams();
    const { auth } = useStore();

    const user = useLocalObservable(() => User.create({ id: userId }));
    useEffect(() => { user.load(userId).catch(err => console.error(err)); }, []);
    const gamesStore = useLocalObservable(() => GamesStore.create());
    useEffect(() => { gamesStore.loadForUser(userId).catch(err => console.error(err)); }, []);
   

    const renderGames = useCallback((games) => (
        <div className={styles.games}>            
            <div className={styles.games__list}>
                {games.map((g, i) =>
                    (<GameCard key={i} game={g} />)
                )}
            </div>
        </div>
    ), []);

    

    return (
        <>
            <Helmet>
                <title></title>
            </Helmet>
            <Header/>
            <PageLayout>
                <h2 className={styles.personTitle}>{"Мои проекты"}</h2>
                {/* <div className={styles.gamesGrid}>
                    {games.array().map((game, i) => <GameCard key={i} game={game} />)} 
                </div> */}
                <div >
                    {gamesStore.array().length > 0 && renderGames(gamesStore.array())}  
                </div>
            </PageLayout>           

            
            {/* <div className={styles.gamesGrid}>
                {gamesStore.array().length > 0 && renderGames(gamesStore.array())}  
            </div> */}
        </>
    );
}

export default observer(ProjectPage);
