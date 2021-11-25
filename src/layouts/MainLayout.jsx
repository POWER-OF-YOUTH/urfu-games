import React from "react";
import { Box } from "@material-ui/system";
import styles from "./PageLayout.module.css";
import Header from "../components/Header";

class MainLayout extends React.Component {
    render() {
        return (
            <Box className={styles.root}>
                <Header/>
                <Box className={styles.content}>
                    <Box className={styles.sidePage}>{this.props.sidePageComponent}</Box>
                    {this.props.children}                
                </Box>
            </Box>
        );
    }
}

export default MainLayout;
