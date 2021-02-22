import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import type { Semester } from '../../../../api/plans';
import { CourseWrapper } from '../CourseWrapper';

interface SemesterWrapperProps {
  semester: Semester;
}

export const SemesterWrapper = ({ semester }: SemesterWrapperProps) => {
  return (
    <>
      <div style={{ width: semester.isGap ? 200 : 300 }}>
        {semester.isGap ? (
          'wolne :)'
        ) : (
          <Droppable droppableId={semester.semesterNumber.toString()}>
            {(provided) => (
              <div
                style={{ minHeight: 600, border: '1px solid blue', width: 300 }}
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
        )}
      </div>
    </>
  );
};
