import * as React from "react";
import SearchIcon from "@material-ui/icons/Search";
import { Button, Typography, Toolbar, Box, AppBar } from "@material-ui/core";
import { Link, useParams } from "react-router-dom";
import styles from "./LoadPage.module.css";
import  Header  from "../components/Header";

export default function App() {

    return (
        <Box>
            <AppBar color="default" className={styles.allbar}>
                <Toolbar>
                    <Typography variant="h4" className={styles.logotip}>
                        UrFU Games
                    </Typography>

                    <div className={styles.regbutton}>
                        <Link to="/signin">
                            <button className={styles.regbutton1}>Войти </button>
                        </Link>
                        <Link to="/signup">
                            <button className={styles.regbutton2}>Зарегистрироваться </button>
                        </Link>

                    </div>
                </Toolbar>
            </AppBar>
            <div className={styles.container}>

            </div>

        </Box>
    );
}
