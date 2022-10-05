import React from 'react';
import { Tag } from '@blueprintjs/core';

interface CourseEffect {
  key: number;
  value: string;
}

export const courseEffects: CourseEffect[] = [
  {
    key: 2,
    value: 'PiPO',
  },
  {
    key: 3,
    value: 'ASK',
  },
  {
    key: 4,
    value: 'RPdI',
  },
  {
    key: 5,
    value: 'SO',
  },
  {
    key: 6,
    value: 'SK',
  },
  {
    key: 7,
    value: 'BD',
  },
  {
    key: 9,
    value: 'IO',
  },
  {
    key: 10,
    value: 'RPiS',
  },
];

export const courseEffectTagType = {
  passing: { borderBottom: '3px solid rgb(45, 221, 45)' },
  failing: { borderBottom: '3px solid rgb(255, 22, 22)' },
  none: {},
};

interface CourseEffectTagProps {
  effects: number[];
  margin?: number;
  type?: 'passing' | 'failing' | 'none';
}

const CourseEffectTag = (props: CourseEffectTagProps) => (
  <>
    {courseEffects
      .map(({ key, value }) =>
        props.effects.includes(key) ? (
          <Tag
            style={{
              marginLeft: props.margin ?? 5,
              ...courseEffectTagType[props.type || 'none'],
            }}
            key={key}
          >
            {value}
          </Tag>
        ) : null,
      )
      .filter((val) => val)}
  </>
);

export default CourseEffectTag;
