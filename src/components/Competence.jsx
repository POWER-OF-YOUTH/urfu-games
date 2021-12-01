import React from "react";

import { Typography } from "@material-ui/core";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import styles from "./Competence.module.css";

function Competence({ competence }) {
    const [popupOpen, setPopupOpen] = React.useState(false);
    const handleClick = () => {
        setPopupOpen(true);
    };
    const handlePopupClose = () => {
        setPopupOpen(false);
        console.log("Close");
    };

    return (
        <>
            <div 
                className={styles.container} 
                style={{ backgroundColor: competence.color }}
                onClick={handleClick}
            >
                <div className={styles.competence}>
                    {competence.name}
                </div>
            </div>

            <CompetenceDialog onClose={handlePopupClose} open={popupOpen}>
                <CompetenceDialogTitle onClose={handlePopupClose}>
                    {competence.name}
                </CompetenceDialogTitle>
                <DialogContent dividers>
                    <Typography gutterBottom>
                        {competence.description}
                    </Typography>
                </DialogContent >
            </CompetenceDialog>
        </>
    );
}

const CompetenceDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
        padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
        padding: theme.spacing(1),
    },
}));

const CompetenceDialogTitle = (props) => {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
};

export default Competence;
