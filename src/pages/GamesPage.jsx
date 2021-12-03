import React from "react";
import Flickity from "react-flickity-component";
import { Button, Typography, Box } from "@material-ui/core";
import { Link, NavLink } from "react-router-dom";
import { observer } from "mobx-react-lite";

import Header from "../components/Header";
import GameCard from "../components/Card";
import Tags from "../components/Tags";
import { useStore } from "../hooks";

import "flickity/css/flickity.css";
import styles from "./GamesPage.module.css";

function GamesPage() {
    const { games } = useStore();

    const [isMobile, setIsMobile] = React.useState(false);

    const fetchAll = async ()=> {
        await games.loadGames();
    };

    React.useEffect(() => {
        window.addEventListener("resize", () => setIsMobile(window.innerWidth < 1000));
       
        fetchAll(() => {}, () => {});
    }, []);
    return (        
        <>
            <Header />
            <main className={styles.content}>
                <Tags />
                <div className={styles.games}>
                    <div className={styles.gamesWrapper}>
                        <div className={styles.gamesBlock}>
                            <div className={styles.captionWrapper}>
                                <Typography variant="h6">
                                    Рекомендуемые
                                </Typography>
                                <NavLink to="/games/:gameId" className={styles.showAll}>
                                    <Typography variant="h6">
                                        {isMobile ? "Все" : "Показать все"}
                                    </Typography>
                                </NavLink>
                            </div>
                            <GamesCardsCarousel>
                                { games.all().map((game, i) => (
                                    <GameCard key={i} game={game} />
                                ))} 
                            </GamesCardsCarousel>
                        </div>
                        <div className={styles.gamesBlock}>
                            <div className={styles.captionWrapper}>
                                <Typography variant="h6">
                                    Все игры
                                </Typography>
                            </div>
                            <Box className={styles.gamesGrid}>
                                { games.all().map((game, i) => (
                                    <GameCard key={i} game={game} />
                                ))} 
                            </Box>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

function GamesCardsCarousel({ children }) {
    const flickityOptions = {
        wrapAround: false,
        contain: true,
        freeSroll: false,
        pageDots: false,
        groupCells: true,
        arrowShape: "M 0,50 L 60,00 L 50,30 L 80,30 L 80,70 L 50,70 L 60,100 Z",
        prevNextButtons: true,
        cellAlign: "center",
    };

    return (
        <Flickity options={flickityOptions}>
            {children}
        </Flickity>
    );
}

export default observer(GamesPage);
