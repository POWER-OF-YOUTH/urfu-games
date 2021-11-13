import { Dialog, DialogContent, DialogTitle } from "@material-ui/core";
import React from "react";

export default function Popup(props) {
    const { title, childern, openPopup, setOpenPopup } = props;
    return (
        <div>
            <Dialog open={openPopup}>
                <DialogTitle>
                    <div>tiyle</div>
                </DialogTitle>
                <DialogContent>
                    <div>dialog</div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
