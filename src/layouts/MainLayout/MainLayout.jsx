import React from "react";

import Header from "../../components/Header";

import styles from "./MainLayout.module.css";

function MainLayout({ children }) {
    return (
        <>
            <Header />
            <div className={styles.wrapper}>
                {children}
            </div>
        </>
    );
}

export default MainLayout;
