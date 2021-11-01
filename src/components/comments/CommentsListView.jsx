import React from "react";
import { observer } from "mobx-react-lite";

import CommentView from "./CommentView";
import styles from "./CommentsListView.module.css";

function CommentsListView({ store }) {
    return (
        <div className={styles.commentsContainer}>
            {store.orderedByDateDescending.map((comment, i) => ( 
                <CommentView key={i} store={store} comment={comment} /> 
            ))}
        </div>
    );
}

export default observer(CommentsListView);
