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
        competencies: types.map(Competence)
    })
    .views(self => ({
        array() {
            return values(self.competencies);
        },
        get(id) {
            return self.competencies[id];
        }
    }))
    .actions(self => ({
        load: flow(function* (start = 0, count = 10) {
            const response = yield competenciesAPI.getCompetencies(start, count);

            if (response.ok) {
                const json = yield response.json();

                const competencies = {};
                json.forEach(c => competencies[c.id] = c);

                self.competencies = competencies;
            }
        })
    }));

export { Competence, CompetenciesStore };
