import React from "react";
// import SearchIcon from "@material-ui/icons/Search";
// import { Search, SearchIconWrapper, StyledInputBase } from "../styles/Default";
import { Button, Typography, Box } from "@material-ui/core";
import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import styles from "./GamesPage.module.css";
import Header from "../components/Header";
import Competence from "../components/Competence";
import GameCard from "../components/Card";
import Popup from "../components/Dialog";
import PageLayout from "../layouts/PageLayout";
import MainLayout from "../layouts/MainLayout";
import Tags from "../components/Tags";
import test from "../components/images/test.jpg";
import Flickity from "react-flickity-component";
import "flickity/css/flickity.css";
import { useStore } from "../hooks";

function GamesPage() {
    const { games } = useStore();

    const flickityOptions = {
        wrapAround: true,
        freeSroll: true,
        pageDots: false,
        arrowShape: "M 0,50 L 60,00 L 50,30 L 80,30 L 80,70 L 50,70 L 60,100 Z",
        prevNextButtons: true,
        cellAlign: "center",
        pauseAutoPlayOnHover: false,
        initialIndex: 2,
    };
    const [isMobile, setIsMobile] = React.useState(false);

    // const [loading, setLoading] = useState(false);
    
    // const [games, setGames] = React.useState(false);

    const fetchAll= async()=> {
        await games.loadGames();
    };

    React.useEffect(() => {
        window.addEventListener("resize", () => setIsMobile(window.innerWidth < 1000));
       
        fetchAll(() => {}, () => {});
    }, []);

    return (        
        <>
            {games.games ? (
                <div>
                    <Header />
                    <main className={styles.content}>
                        <Tags />
                        <div className={styles.games}>
                            <Box className={styles.menuButton}>
                                <Typography variant="h6" sx={{ ml: 3, mt: 2 }} className={styles.recommendButton}>
                                    Рекомендуемые
                                </Typography>
                                <Link to="/games/:gameId" style={{ color: "#000000" }}>
                                    <Typography variant="h5" sx={{ mr: 6, mt: 2 }}>
                                        {isMobile ? "Все" : "Показать все"}
                                    </Typography>
                                </Link>
                            </Box>
                            <Flickity options={flickityOptions} className={styles.slider}>
                            </Flickity>
                            <Typography variant="h5" sx={{ ml: 3, mt: 2 }}>
                                Все игры
                            </Typography>
                            <Box className={styles.allgame} sx={{ ml: 3 }}>
                                { games.all().map((game, i) => (
                                    <GameCard key={i} game={game} />
                                ))} 
                            </Box>
                        </div>
                    </main>
                </div>
            ) : (
                <></>
            )}
        </>
    );
}

export default observer(GamesPage);
