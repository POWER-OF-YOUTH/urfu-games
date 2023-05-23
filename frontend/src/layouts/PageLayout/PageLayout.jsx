import React from "react";
import classNames from "classnames";

import Block from "../../components/Block";

import styles from "./PageLayout.module.css";
import CompetenciesList from "../../components/CompetenciesList";

function PageLayout({ className, children, ...props }) {
    return (
        <div className={styles.pageGrid}>
            <div className={styles.sideBar}>
                <span className={styles.titleText}>Навигация</span>
                <CompetenciesList className={styles.competenciesList}></CompetenciesList>
            </div>
            <Block className={classNames(className, styles.content)}>
                <div className={classNames(styles.content__wrapper)}>
                    {children}
                </div>
            </Block>
        </div>
    );
}

export default PageLayout;
