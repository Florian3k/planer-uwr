import { useTracker } from 'meteor/react-meteor-data';
import React from 'react';
import { Courses } from '../../../api/courses';
import { CourseEntry } from '../../../api/plans';

interface CourseWrapperProps {
  course: CourseEntry;
}

export const CourseWrapper = ({ course: { id } }: CourseWrapperProps) => {
  const course = useTracker(() => {
    return Courses.findOne({ id });
  }, [id])!;

  const source = course.source === 'courses' ? course.semester : 'Oferta';

  return (
    <div
      style={{
        minWidth: 200,
        maxWidth: 300,
        flexGrow: 2,
        border: '1px solid red',
        margin: 4,
        padding: 4,
      }}
    >
      <div>{course.name}</div>
      <div>
        {course.ects} ECTS - {source}
      </div>
    </div>
  );
};
