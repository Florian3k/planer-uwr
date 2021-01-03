import React from 'react';

import { Course } from '/imports/api/courses';

interface ListingProps {
  courses: Course[];
}
export const Listing = ({ courses }: ListingProps) => {
  return (
    <div style={{ minWidth: 200, maxWidth: 300, flexGrow: 2 }}>
      {courses.map((course) => (
        <div key={course._id}>
          {course.name} - {course.semester}
        </div>
      ))}
    </div>
  );
};
