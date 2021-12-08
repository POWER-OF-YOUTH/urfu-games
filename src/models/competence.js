import { types, flow, applySnapshot } from "mobx-state-tree";
import { values } from "mobx";

import { DateTime } from "./custom";
import * as competenciesAPI from "../utils/api/competenciesAPI";

const colors = [
    "#DB5762",
    "#DB44E8",
    "#60C6E8",
    "#4352E8",
    "#0CD414",
    "#FFB347",
    "#8252E8"
];

const Competence = types
    .model({
        id: types.identifier,
        name: types.string,
        description: types.string,
        color: "gray",
        createdAt: DateTime
    })
    .actions(self => ({ 
        afterCreate() {
            self.color = colors[Math.floor(Math.random() * colors.length)];
        }
    }));

const CompetenciesStore = types
    .model({
        competencies: types.map(Competence)
    })
    .views(self => ({
        all() {
            return values(self.competencies);
        }
    }))
    .actions(self => ({
        load: flow(function* (start = 0, count = 10) {
            const response = yield competenciesAPI.getCompetencies(start, count);

            if (response.ok) {
                const json = yield response.json();

                // Добавляем в хранилище только новые компетенции
                json
                    .filter(c => !self.competencies.has(c.id))
                    .forEach(c => self.competencies.put(c));
            }
        }),
        loadOne: flow(function* (competenceId) {
            if (!self.competencies.has(competenceId)) {
                const response = yield competenciesAPI.getCompetence(competenceId);

                if (response.ok) 
                    self.competencies.put(yield response.json());
            }
        })
    }));

export { Competence, CompetenciesStore };
