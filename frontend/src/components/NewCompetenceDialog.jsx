import React from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent
} from "@mui/material";

import NewCompetenceForm from "./NewCompetenceForm";

function NewCompetenceDialog({onClose, ...props}) {
    const handleClose = onClose;

    return (
        <Dialog {...props}>
            <DialogTitle>Создание компетенции</DialogTitle>
            <DialogContent>
                <NewCompetenceForm />
                <DialogActions>
                    <Button onClick={handleClose}>Готово</Button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    );
}

export default NewCompetenceDialog;
