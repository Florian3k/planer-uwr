import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { Course } from '../../../../api/courses';
import type { Semester } from '../../../../api/plans';
import { CourseWrapper } from '../CourseWrapper';

interface SemesterWrapperProps {
  courses: Record<string, Course>;
  semester: Semester;
  ects: number;
  totalEcts: number;
}

export const SemesterWrapper = ({
  courses,
  semester,
  ects,
  totalEcts,
}: SemesterWrapperProps) => {
  if (semester.isGap) {
    return (
      <>
        <div style={{ gridRow: 1 }}>Semester header</div>
        <div style={{ gridRow: 2, width: 200 }}>wolne :)</div>
      </>
    );
  }
  return (
    <>
      <div style={{ gridRow: 1 }}>
        <div>Semester header {semester.semesterNumber}</div>
        <div>ECTS w tym semestrze: {ects}</div>
        <div>ECTS do tej pory: {totalEcts}</div>
      </div>
      <div style={{ gridRow: 2, width: 300 }}>
        <Droppable droppableId={semester.semesterNumber.toString()}>
          {(provided) => (
            <div
              style={{ height: '100%', border: '1px solid blue', width: 300 }}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {semester.courses.length ? (
                semester.courses.map((course, courseIndex) => (
                  <Draggable
                    draggableId={`${semester.semesterNumber}-${courseIndex}-${course.id}`}
                    index={courseIndex}
                    key={`${semester.semesterNumber}-${courseIndex}-${course.id}`}
                  >
                    {(provided) => (
                      <CourseWrapper course={course} provided={provided} />
                    )}
                  </Draggable>
                ))
              ) : (
                <div>Brak przedmiotów</div>
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </>
  );
};
