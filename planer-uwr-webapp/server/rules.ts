import { Rule } from '/imports/api/rulesets';

const project: Rule = {
  name: 'Projekt',
  description: 'Projekt programistyczny',
  condition: true,
  selector: [
    {
      field: 'courseType',
      value: [13],
    },
  ],
  subRules: null,
};

// const getEffectsRule = (kind: "bachelor" | "engineering") => {

// }

export const bachelorRules: Rule[] = [
  {
    name: 'I + I.Inż + I2 >= 54',
    description: 'przedmioty informatyczne',
    condition: 54,
    selector: [
      {
        field: 'courseType',
        value: [5, 7, 38, 39],
      },
    ],
    subRules: null,
  },
  project,
  {
    name: 'O+I+K+P >= 140',
    description: 'Łącznie przedmioty O + I + K + P',
    condition: 140,
    selector: [
      {
        field: 'courseType',
        value: [5, 6, 7, 8, 9, 10, 13, 36, 37, 38, 39, 40],
      },
    ],
    subRules: null,
  },
];

export const engineeringRules: Rule[] = [
  {
    name: 'I + I.Inż + I2 >= 66',
    description: 'przedmioty informatyczne',
    condition: 66,
    selector: [
      {
        field: 'courseType',
        value: [5, 7, 38, 39],
      },
    ],
    subRules: null,
  },
  {
    name: 'I.Inż >= 12',
    description: 'przedmioty informatyczne inż.',
    condition: 12,
    selector: [
      {
        field: 'courseType',
        value: [7],
      },
    ],
    subRules: null,
  },
  {
    name: 'K.Inż >= 10',
    description: 'Kursy inżynierskie',
    condition: 10,
    selector: [
      {
        field: 'courseType',
        value: [40],
      },
    ],
    subRules: null,
  },
  project,
  {
    name: 'O+I+K+P >= 170',
    description: 'Łącznie przedmioty O + I + K + P',
    condition: 170,
    selector: [
      {
        field: 'courseType',
        value: [5, 6, 7, 8, 9, 10, 13, 36, 37, 38, 39, 40],
      },
    ],
    subRules: null,
  },
  {
    name: 'Efekty kształcenia',
    description: 'Efekty kształcenia',
    condition: 28,
    selector: [
      {
        field: 'courseType',
        value: [5, 7, 36, 40],
      },
      {
        field: 'effects',
        value: [2, 3, 5, 6, 7, 9, 10],
      },
    ],
    subRules: [
      {
        name: 'RPiS',
        description: 'Rachunek Prawdopodobieństwa i Statystyka',
        condition: true,
        selector: [{ field: 'effects', value: [10] }],
      },
      {
        name: 'IO',
        description: 'Inżynieria oprogramowania',
        condition: true,
        selector: [{ field: 'effects', value: [9] }],
      },
      {
        name: 'PiPO',
        description: 'Programowanie i projektowanie obiektowe',
        condition: true,
        selector: [{ field: 'effects', value: [2] }],
      },
      {
        name: 'ASK',
        description: 'Architektury systemów komputerowych',
        condition: true,
        selector: [{ field: 'effects', value: [3] }],
      },
      {
        name: 'SO',
        description: 'Systemy operacyjne',
        condition: true,
        selector: [{ field: 'effects', value: [5] }],
      },
      {
        name: 'SK',
        description: 'Sieci komputerowe',
        condition: true,
        selector: [{ field: 'effects', value: [6] }],
      },
      {
        name: 'BD',
        description: 'Bazy danych',
        condition: true,
        selector: [{ field: 'effects', value: [7] }],
      },
    ],
  },
];
