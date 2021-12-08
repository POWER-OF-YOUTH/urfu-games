import React from "react";

import Block from "./Block";

import styles from "./CompetenciesList.module.css";

function CompetenciesList({ className = "", children }) {
    return (
        <Block className={`${styles.competencies} ${className}`}>
            <div className={styles.titleContainer}>
                <h2 className={styles.title}>Компетенции</h2>
            </div>
            <div className={styles.competenciesContainer}>
                {children}
            </div>
        </Block>
    );
}

export default CompetenciesList;
