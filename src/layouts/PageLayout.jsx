import React from "react";
import { Box } from "@material-ui/system";
import styles from "./PageLayout.module.css";
import Header from "../components/Header";

class PageLayout extends React.Component {
    render() {
        return (
            <Box className={styles.root}>
                <Box className={styles.gamesGrid}>{this.props.children}</Box>
            </Box>
        );
    }
}

export default PageLayout;
