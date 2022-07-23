import React from "react";
import classNames from "classnames";

import Block from "../../components/Block";

import styles from "./PageLayout.module.css";

function PageLayout({ className, children, ...props }) {
    return (
        <Block className={classNames(className, styles.content)}>
            <div className={classNames(styles.content__wrapper)}>
                {children}
            </div>
        </Block>
    );
}

export default PageLayout;
