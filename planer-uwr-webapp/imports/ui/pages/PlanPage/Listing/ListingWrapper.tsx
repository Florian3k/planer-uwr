import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { CourseWrapper } from '../CourseWrapper';

import { Course } from '/imports/api/courses';

interface ListingWrapperProps {
  courses: Course[];
  showTrash: boolean;
}
export const ListingWrapper = ({ courses, showTrash }: ListingWrapperProps) => {
  return (
    <>
      <div style={{ position: 'relative' }}>
        <Droppable droppableId="trash" isDropDisabled={!showTrash}>
          {(provided) => (
            <div
              style={{
                position: 'absolute',
                background: 'rgba(255, 0, 0, 0.5)',
                width: 200,
                height: 200,
                fontSize: 40,
                visibility: showTrash ? 'unset' : 'hidden',
              }}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              KOSZ
              <div>{provided.placeholder}</div>
            </div>
          )}
        </Droppable>
        <div style={{ minWidth: 300, maxWidth: 300, flexGrow: 2 }}>
          <Droppable droppableId="listing" isDropDisabled>
            {(provided) => (
              <div
                style={{ border: '1px solid green' }}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {courses.map((course, courseIndex) => (
                  <Draggable
                    draggableId={`listing-${course._id}`}
                    index={courseIndex}
                    key={`listing-${course._id}`}
                  >
                    {(provided, snapshot) => (
                      <>
                        <CourseWrapper course={course} provided={provided} />
                        {snapshot.isDragging && (
                          <CourseWrapper course={course} />
                        )}
                      </>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </div>
    </>
  );
};
