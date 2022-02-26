import React from "react";
import { observer } from "mobx-react-lite";

import CommentView from "./CommentView";
import styles from "./CommentsListView.module.css";

// store - CommentsStore
function CommentsListView({ store }) {
    const handleCommentDelete = (comment) => store.delete(comment.id);

    return (
        <div className={styles.commentsContainer}>
            {store.array().map((comment, i) => ( 
                <CommentView 
                    key={i} 
                    comment={comment} 
                    onDelete={handleCommentDelete}
                /> 
            ))}
        </div>
    );
}

export default observer(CommentsListView);
