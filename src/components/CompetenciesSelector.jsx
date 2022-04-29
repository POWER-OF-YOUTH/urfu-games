// Компонент `CompetenciesSelector` используется для выбора компетенций.

import React, { useState, useEffect } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import classNames from "classnames";
import Competence from "./Competence";
import { styled } from "@mui/material/styles";
import { IconButton, Select, MenuItem } from "@mui/material";

import CompetenciesSearch from "./CompetenciesSearch";

import styles from "./CompetenciesSelector.module.css";

function CompetenciesSelector({
    className,
    // Вызвается, когда изменяется список выбранных компетенций.
    onChange = (f) => f,
    ...props
}) {
    const [selectedCompetencies, setSelectedCompetencies] = useState([]);

    // Передается в компонент `CompetenciesSearch`. Используется для того, чтобы
    // убрать из результата поиска тех компетенций, которых мы уже выбрали.
    const filterUnselectedParticipants = (competencies) => {
        const result = [];

        for (const comp of competencies) {
            if (selectedCompetencies.find((u) => u.name === comp.name) === undefined) result.push(comp);
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

    useEffect(() => onChange(selectedCompetencies), [selectedCompetencies]);

    return (
        <div className={styles.participantsSelector}>
            <CompetenciesSearch onSelect={handleCompetenceSelect} filterOptions={filterUnselectedParticipants} />
            {selectedCompetencies.length > 0 && (
                <SelectedCompetencies className={styles.participantsSelector__selectedParticipants}>
                    {selectedCompetencies.map((c, i) => (
                        <CompetenceItem key={i} competence={c} onDelete={handleCompetenciesDelete} enableDelete />
                    ))}
                </SelectedCompetencies>
            )}
        </div>
    );
}

// Компонент `SelectedParticipants` - контейнер, в котором
// будут отображаться выбранные участники.
function SelectedCompetencies({ className, children, ...props }) {
    // TODO:
    return (
        <div className={styles.selectedParticipants}>
            <div className={styles.selectedParticipants__headers}>
                <span className={styles.selectedParticipants__header}>Выбранные компетенции:</span>
            </div>
            <ul className={styles.selectedParticipants__list}>{children}</ul>
        </div>
    );
}

// `CompetenceItem` используется для отображения информации о компетенции.
// Его следует передавать передавать в `SelectedCompetencies`.
function CompetenceItem({
    className,
    competence,
    onDelete = (f) => f,
    enableDelete = false, // Если указано значение false, то крестик отображаться не будет.
    ...props
}) {
    return (
        <li className={classNames(styles.selectedParticipants__participant, styles.participant)}>
            <Competence competence={competence} enablePopup />
            <div className={styles.participant__deleteButtonContainer}>
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

export default CompetenciesSelector;
