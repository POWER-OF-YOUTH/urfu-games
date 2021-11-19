import React from "react";
import { observer } from "mobx-react-lite";

import CommentView from "./CommentView";
import styles from "./CommentsListView.module.css";

function CommentsListView({ comments }) {
    return (
        <div className={styles.commentsContainer}>
            {comments.orderedByDateDescending().map((comment, i) => ( 
                <CommentView key={i} store={comments} comment={comment} /> 
            ))}
        </div>
    );
}

export default observer(CommentsListView);
