import { useTracker } from 'meteor/react-meteor-data';
import React from 'react';
import { DraggableProvided } from 'react-beautiful-dnd';
import { Courses } from '../../../api/courses';
import { CourseEntry } from '../../../api/plans';
import { courseTypeById, getTextColor } from '../../../utils';
import { Tag } from '@blueprintjs/core';
import { Tooltip2, Popover2 } from '@blueprintjs/popover2';

interface CourseWrapperProps {
  course: CourseEntry;
  provided?: DraggableProvided;
}

export const CourseWrapper = ({
  course: { id },
  provided,
}: CourseWrapperProps) => {
  const course = useTracker(() => {
    return Courses.findOne({ id });
  }, [id]);

  if (!course) {
    return (
      <div
        ref={provided?.innerRef}
        {...provided?.draggableProps}
        {...provided?.dragHandleProps}
      ></div>
    );
  }

  const source = course.source === 'courses' ? course.semester : 'Oferta';
  const courseType = courseTypeById[course.courseType];
  const ectsPercent = (course.ects > 10) ? 10 : (course.ects * 10);
  if (course.ects > 10) {
    console.log(course.name, course.ects);
  }

  

  return (
    <div
      ref={provided?.innerRef}
      {...provided?.draggableProps}
      {...provided?.dragHandleProps}
      className={`course-wrapper ${provided ? '' : 'course-wrapper-clone'}`}
    >
      <div
        style={{
          width: 300,
          padding: 4,
          paddingBottom: 0,
        }}
      >
        <div className='course-wrapper-inner'>
          <div className='course-title'>{course.name}</div>
          <div>
            {courseType && (
              <Popover2>
                <Tooltip2 content={courseType.fullName} position='bottom' hoverOpenDelay={300}>
                  <Tag style={{
                      backgroundColor: `rgb(${courseType.color.join(',')})`,
                      color: getTextColor(courseType.color)
                    }}
                  >
                    {courseType.name}
                  </Tag>
                </Tooltip2>
              </Popover2>
            )}
            <Tag className='ects-tag' style={{
              backgroundColor: `hsl(0, 0%, ${ectsPercent*0.7 + 15}%)`,
              color: getTextColor([ectsPercent * 2.55, ectsPercent * 2.55, ectsPercent * 2.55])
            }}>
              {course.ects} ECTS
            </Tag>
            <Tag className='source-tag'>
              {source}
            </Tag>
          </div>
        </div>
      </div>
    </div>
  );
};
