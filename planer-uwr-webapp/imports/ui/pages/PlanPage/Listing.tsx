import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { CourseWrapper } from './CourseWrapper';

import { Course } from '/imports/api/courses';

interface ListingProps {
  courses: Course[];
}
export const Listing = ({ courses }: ListingProps) => {
  return (
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
                {(provided) => (
                  <CourseWrapper course={course} provided={provided} />
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};
