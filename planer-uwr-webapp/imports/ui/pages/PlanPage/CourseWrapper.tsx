import { useTracker } from 'meteor/react-meteor-data';
import React from 'react';
import { DraggableProvided } from 'react-beautiful-dnd';
import { Courses } from '../../../api/courses';
import { CourseEntry } from '../../../api/plans';

interface CourseWrapperProps {
  course: CourseEntry;
  provided: DraggableProvided;
}

export const CourseWrapper = ({
  course: { id },
  provided,
}: CourseWrapperProps) => {
  const course = useTracker(() => {
    return Courses.findOne({ id });
  }, [id])!;

  const source = course.source === 'courses' ? course.semester : 'Oferta';

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      <div
        style={{
          minWidth: 200,
          maxWidth: 300,
          flexGrow: 2,
          padding: 4,
          paddingBottom: 0,
        }}
      >
        <div style={{ padding: 4, border: '1px solid red' }}>
          <div>{course.name}</div>
          <div>
            {course.ects} ECTS - {source}
          </div>
        </div>
      </div>
    </div>
  );
};
