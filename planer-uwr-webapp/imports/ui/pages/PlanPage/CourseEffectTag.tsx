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

export const courseEffectTagType = {
  passing: { borderBottom: '2px solid rgb(103, 214, 103)', backgroundColor: '##C0D6BF' },
  failing: { borderBottom: '2px solid rgb(255, 74, 74)', backgroundColor: '##D6BFBF' },
  none: { border: 'auto', backgroundColor: 'auto' },
}

interface CourseEffectTagProps {
  effects: number[];
  margin?: number;
  type?: 'passing' | 'failing' | 'none';
}

const CourseEffectTag = (props: CourseEffectTagProps) => (
  <>
    {courseEffects.map(({ key, value }) => (
      props.effects.includes(key) ? (
        <Tag
          style={{
            marginLeft: (props.margin != null) ? props.margin : 5,
            ...courseEffectTagType[props.type || 'none'],
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
