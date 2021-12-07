import React from "react";
import { Typography } from "@material-ui/core";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

function Competence({ competence, enablePopup = false, size = "medium" }) {
    const [popupOpen, setPopupOpen] = React.useState(false);
    const handleClick = () => {
        setPopupOpen(true);
    };
    const handlePopupClose = () => {
        setPopupOpen(false);
    };

    return (
        <>
            <CompetenceContainer size={size} color={competence.color} onClick={handleClick}>
                <CompetenceName>
                    {competence.name}
                </CompetenceName>
            </CompetenceContainer>

            { enablePopup ? (
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
            ) : (
                <></>
            )}
        </>
    );
}

const CompetenceContainer = styled("div")(({ color, size }) => ({
    cursor: "pointer",
    height: "23px",
    display: "inline-block",
    padding: "2px 10px",
    borderRadius: "40px",
    alignContent: "center",
    textAlign: "center",
    backgroundColor: color,
    ...(size === "small" && {
        padding: "1px 5px"
    }),
    ...(size === "medium" && {
        padding: "2px 10px"
    }),
    ...(size === "large" && {
        padding: "5px 15px"
    })
}));

const CompetenceName = styled("span")({
    color: "white",
    fontWeight: "bold"
});

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
