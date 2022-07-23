/**
 * @file Компонент `CompetenciesSelector`.
 */

import React, { useState, useEffect, useRef } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import classNames from "classnames";
import Competence from "./Competence";
import { styled } from "@mui/material/styles";
import { IconButton, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import CompetenciesSearch from "./CompetenciesSearch";
import NewCompetenceDialog from "./NewCompetenceDialog";

import styles from "./CompetenciesSelector.module.css";

function CompetenciesSelector({
    className,
    onChange = (f) => f, ///< Вызвается, когда изменяется список выбранных компетенций.
    required,
    ...props
}) {
    const [selectedCompetencies, setSelectedCompetencies] = useState([]);
    const [newCompetenceDialogOpen, setNewCompetenceDialogOpen] = useState(false);

    const selectElement = useRef(null);

    /**
     * Передается в компонент `CompetenciesSearch`. Используется для того, чтобы
     * убрать из результата поиска те компетенции, которые уже были выбраны.
     */
    const filterUnselectedParticipants = (competencies) => {
        const result = [];

        for (const comp of competencies) {
            if (selectedCompetencies.find((u) => u.name === comp.name) === undefined)
                result.push(comp);
        }

        return result;
    };

    const handleCompetenceSelect = (user) => {
        if (user !== null) setSelectedCompetencies([user, ...selectedCompetencies]);
    };
    const handleCompetenciesDelete = (userIndex) => {
        selectedCompetencies.splice(userIndex, 1);
        setSelectedCompetencies([...selectedCompetencies]);
    };
    const handleNewCompetenceButtonClick = () => setNewCompetenceDialogOpen(true);
    const handleNewCompetenceDialogClose = () => setNewCompetenceDialogOpen(false);

    useEffect(() => {
        if (selectElement !== null) {
            selectElement.current.values = selectedCompetencies;
            selectElement.current.onchange = onChange;
            selectElement.current.dispatchEvent(new Event("change"));
        }
    }, [selectedCompetencies]);

    return (
        <div className={styles.competenciesSelector}>
            <div className={styles.searchContainer}>
                <CompetenciesSearch
                    className={styles.search}
                    onSelect={handleCompetenceSelect}
                    filterOptions={filterUnselectedParticipants}
                />
                <div className={styles.newButtonContainer}>
                    <NewCompetenceButton
                        variant="contained"
                        color="success"
                        onClick={handleNewCompetenceButtonClick}
                    >
                        <AddIcon />
                    </NewCompetenceButton>
                </div>
            </div>
            <select 
                style={{width: "1px", height: "1px", opacity: "0", position: "absolute"}}
                ref={selectElement}
                required={required && selectedCompetencies.length == 0}
            />
            {selectedCompetencies.length > 0 && (
                <SelectedCompetencies className={styles.competenciesSelector__selectedCompetencies}>
                    {selectedCompetencies.map((c, i) => (
                        <CompetenceItem key={i} competence={c} onDelete={handleCompetenciesDelete} enableDelete />
                    ))}
                </SelectedCompetencies>
            )}
            <NewCompetenceDialog
                open={newCompetenceDialogOpen}
                onClose={handleNewCompetenceDialogClose}
            />
        </div>
    );
}

/** 
 * Компонент `SelectedCompetencies` - контейнер, в котором
 * будут отображаться выбранные компетенции.
 */
function SelectedCompetencies({ className, children, ...props }) {
    // TODO:
    return (
        <div className={styles.selectedCompetencies}>
            <div className={styles.selectedCompetencies__headers}>
                <span className={styles.selectedCompetencies__header}>Выбранные компетенции:</span>
            </div>
            <ul className={styles.selectedCompetencies__list}>{children}</ul>
        </div>
    );
}

/**
 * `CompetenceItem` используется для отображения информации о компетенции.
 * Его следует передавать передавать в `SelectedCompetencies`.
 */
function CompetenceItem({
    competence,
    onDelete = (f) => f,
    enableDelete = false, ///< Если указано значение false, то крестик отображаться не будет.
    ...props
}) {
    return (
        <li className={classNames(styles.selectedCompetencies__participant, styles.competence)}>
            <Competence competence={competence} enablePopup />
            <div className={styles.competence__deleteButtonContainer}>
                {enableDelete && (
                    <DeleteButton onClick={onDelete}>
                        <ClearIcon />
                    </DeleteButton>
                )}
            </div>
        </li>
    );
}

const DeleteButton = styled(IconButton)({
    padding: "0px",
});

const NewCompetenceButton = styled(Button)({
    width: "100%",
    height: "100%"
});

export default CompetenciesSelector;
