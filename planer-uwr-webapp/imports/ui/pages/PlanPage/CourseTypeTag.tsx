import React from 'react';
import { Tooltip2, Popover2 } from '@blueprintjs/popover2';
import { Tag } from '@blueprintjs/core';
import { getTextColor, CourseType } from '../../../utils';

interface CourseTypeTagProps {
  courseType: CourseType;
}

const CourseTypeTag = (props: CourseTypeTagProps) => (
  <>
    {props.courseType && (
      <Popover2>
        <Tooltip2
          content={props.courseType.fullName}
          position="bottom"
          hoverOpenDelay={300}
        >
          <Tag
            style={{
              backgroundColor: `rgb(${props.courseType.color.join(',')})`,
              color: getTextColor(props.courseType.color),
              textAlign: 'center',
            }}
          >
            {props.courseType.name}
          </Tag>
        </Tooltip2>
      </Popover2>
    )}
  </>
);

export default CourseTypeTag;
