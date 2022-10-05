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
      <div className="semester-heading">
        <div className="semester-title">Semestr {semester.semesterNumber}</div>
        <div>
          <div className="ects">{ects}</div>
          <div className="desc">ECTS w tym semestrze</div>
        </div>
        <div>
          <div className="ects">{totalEcts}</div>
          <div className="desc">ECTS do tej pory</div>
        </div>
      </div>
      <Droppable droppableId={semester.semesterNumber.toString()}>
        {(provided) => (
          <div
            className="semester-wrapper"
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
              <span className="empty-semester">Brak przedmiotów</span>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </>
  );
};
