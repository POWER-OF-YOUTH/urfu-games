import React from "react";
import { Box } from "@material-ui/core";
import { observer } from "mobx-react-lite";

import Competence from "./Competence";

import styles from "./CompetenciesList.module.css";

function CompetenciesList({ className = "", children }) {
    return (
        <aside className={`${styles.competencies} ${className}`}>
            <div className={styles.titleContainer}>
                <h2 className={styles.title}>Компетенции</h2>
            </div>
            <div className={styles.competenciesContainer}>
                {children}
            </div>
        </aside>
    );
}

export default observer(CompetenciesList);
