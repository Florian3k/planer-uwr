import React from 'react';

import { Course } from '../../../../api/courses';
import { Semester } from '../../../../api/plans';
import { SemesterWrapper } from './SemesterWrapper';

interface SemestersWrapperProps {
  courses: Record<string, Course>;
  semesters: Semester[];
}

export const SemestersWrapper = ({
  courses,
  semesters,
}: SemestersWrapperProps) => {
  let sum = 0;

  return (
    <div className='semesters-wrapper'>
      {semesters.map((semester, index) => {
        if (semester.isGap) {
          return (
            <SemesterWrapper
              courses={courses}
              semester={semester}
              key={index}
              ects={0}
              totalEcts={0}
            />
          );
        }

        const partialSum = semester.courses
          .map((course) => {
            if (courses[course.id] === undefined) {
              console.log("UNDEFINED")
              console.log({ courses, course })
            }
            return course.source === 'custom'
              ? 0 /* TOOD custom courses  */
              : courses[course.id]?.ects ?? 0
          }
          )
          .reduce((a, b) => a + b, 0);
        sum += partialSum;

        return (
          <SemesterWrapper
            courses={courses}
            semester={semester}
            key={index}
            ects={partialSum}
            totalEcts={sum}
          />
        );
      })}
    </div>
  );
};
