import React from "react";
import classNames from "classnames";

function PageTitle({ className, children, ...props }) {
    return (
        <h1 className={classNames(className)} {...props}>
            {children}
        </h1>
    );
}

export default PageTitle;
