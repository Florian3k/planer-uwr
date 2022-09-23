import React from 'react';
import { Tag } from '@blueprintjs/core';

interface CourseEffect {
  key: number,
  value: string,
}

export const courseEffects: CourseEffect[] = [
  {
    key: 2,
    value: 'PiPO'
  },
  {
    key: 3,
    value: 'ASK'
  },
  {
    key: 5,
    value: 'SO'
  },
  {
    key: 6,
    value: 'SK'
  },
  {
    key: 7,
    value: 'BD'
  },
  {
    key: 9,
    value: 'IO'
  },
  {
    key: 10,
    value: 'RPiS'
  },
];

interface CourseEffectTagProps {
  effects: number[];
}

const CourseEffectTag = (props: CourseEffectTagProps) => (
  <>
    {courseEffects.map(({ key, value }) => (
      props.effects.includes(key) ? (
        <Tag
          style={{
            marginLeft: 5
          }}
          key={key}
        >
          {value}
        </Tag>
      ) : null
    )).filter((val) => val)}
  </>
);

export default CourseEffectTag;