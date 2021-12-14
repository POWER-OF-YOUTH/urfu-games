import { types, flow, applySnapshot } from "mobx-state-tree";
import { values, observable } from "mobx";

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
        createdAt: DateTime
    })
    .extend(self => {
        const _color = observable.box(colors[Math.floor(Math.random() * colors.length)]);

        return {
            views: {
                get color() {
                    return _color.get();
                }
            }
        };
    });

const CompetenciesStore = types
    .model({
        competencies: types.array(Competence)
    })
    .views(self => ({
        all() {
            return self.competencies;
        }
    }))
    .actions(self => ({
        load: flow(function* (start = 0, count = 10) {
            const response = yield competenciesAPI.getCompetencies(start, count);

            if (response.ok) {
                const json = yield response.json();

                applySnapshot(self.competencies, json);
            }
        }),
        loadOne: flow(function* (competenceId) {
            if (self.competencies.find(c => c.id === competenceId) === undefined)
            {
                const response = yield competenciesAPI.getCompetence(competenceId);

                if (response.ok) 
                    self.competencies.push(yield response.json());
            }
        })
    }));

export { Competence, CompetenciesStore };
