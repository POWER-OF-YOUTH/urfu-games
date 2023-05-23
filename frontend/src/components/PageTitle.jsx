import React from "react";
import classNames from "classnames";

function PageTitle({ className, children, ...props }) {
    return (
        <span className={classNames(className)}  {...props}>
            {children}
        </span>
    );
}

export default PageTitle;
