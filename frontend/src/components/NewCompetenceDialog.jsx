import React from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent
} from "@mui/material";

import NewCompetenceForm from "./NewCompetenceForm";
import NavMainButton from "./NavMainButton";
import NavButton from "./NavButton";

function NewCompetenceDialog({onClose, ...props}) {
    const handleClose = onClose;

    return (
        <Dialog {...props}>
            <DialogTitle><h2>Cоздание компетенции</h2></DialogTitle>
            <DialogContent>
                <NewCompetenceForm />
                <DialogActions>
                    {/* <Button onClick={handleClose}>Готово</Button> */}
                    <NavButton text={"Готово"} onClick={handleClose}></NavButton>                    
                </DialogActions>
            </DialogContent>
        </Dialog>
    );
}

export default NewCompetenceDialog;
