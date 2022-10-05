import { useTracker } from 'meteor/react-meteor-data';
import React from 'react';
import { DraggableProvided } from 'react-beautiful-dnd';
import { Tag } from '@blueprintjs/core';
import { Popover2, Tooltip2 } from '@blueprintjs/popover2';
import { Courses } from '../../../api/courses';
import { CourseEntry } from '../../../api/plans';
import { courseTypeById, getTextColor } from '../../../utils';
import CourseTypeTag from './CourseTypeTag';
import CourseEffectTag from './CourseEffectTag';

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
  const ectsPercent = course.ects > 10 ? 10 : course.ects * 10;

  return (
    <div
      ref={provided?.innerRef}
      {...provided?.draggableProps}
      {...provided?.dragHandleProps}
      className={`course-wrapper ${provided ? '' : 'course-wrapper-clone'}`}
    >
      <div className="course-wrapper-inner">
        <div className="course-title">{course.name}</div>
        <div>
          <CourseTypeTag courseType={courseTypeById[course.courseType]} />
          <Tag
            className="ects-tag"
            style={{
              backgroundColor: `hsl(0, 0%, ${ectsPercent * 0.7 + 15}%)`,
              color: getTextColor([
                ectsPercent * 2.55,
                ectsPercent * 2.55,
                ectsPercent * 2.55,
              ]),
            }}
          >
            {course.ects} ECTS
          </Tag>
          <Tag className="source-tag">{source}</Tag>
          <CourseEffectTag effects={course.effects} />
          {course.owner === 96 ? (
            <div style={{ float: 'right' }}>
              <Popover2>
                <Tooltip2
                  content="Przedmiot Cahira"
                  position="bottom"
                  hoverOpenDelay={300}
                >
                  <img
                    src="https://avatars.githubusercontent.com/u/265236"
                    style={{ borderRadius: 4 }}
                    width={22}
                    height={22}
                  />
                </Tooltip2>
              </Popover2>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
