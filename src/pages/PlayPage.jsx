import * as React from "react";
import { Button, Typography, Toolbar, Box, AppBar } from "@material-ui/core";

import { Link } from "react-router-dom";
import styles from "./GamePage.module.css";

export default function PlayPage() {
    return (
        <Box>
            <AppBar color="default">
                <Toolbar>
                    <Typography  variant="h4" sx={{ mr: 5 }}>
                        UrFU Games
                    </Typography>
                    <Link style={{ textDecoration: "none", color: "#000000" }} to="/game">
                        <Button sx={{ m: 1 }} size="large" color="inherit" variant="text">темы</Button>
                    </Link>
                    <div className={styles.bar}>
                        <Link to="/signup">
                            <button className={styles.barItem} variant="text">Зарегистрироваться </button>
                        </Link>
                        <Link to="/signin">
                            <button className={styles.barItem} variant="text">Войти</button>
                        </Link>
                    </div>
                </Toolbar>
            </AppBar>
            <div>
                <p>Nothing here</p>
            </div>
        </Box>
    );
}

