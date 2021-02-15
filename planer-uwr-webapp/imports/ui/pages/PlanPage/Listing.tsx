import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';

import { Course } from '/imports/api/courses';

interface ListingProps {
  courses: Course[];
}
export const Listing = ({ courses }: ListingProps) => {
  return (
    <div style={{ minWidth: 300, maxWidth: 300, flexGrow: 2 }}>
      <Droppable droppableId="listing" isDropDisabled>
        {(provided, stateSnapshot) => (
          <div
            style={{ border: '1px solid green' }}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            <pre>{JSON.stringify(stateSnapshot, null, 2)}</pre>
            {courses.map((course, courseIndex) => (
              <Draggable
                draggableId={`listing-${course._id}`}
                index={courseIndex}
                key={`listing-${course._id}`}
              >
                {(provided) => (
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
                        border: '1px solid yellow',
                        margin: 4,
                        padding: 4,
                      }}
                    >
                      {course.name} - {course.semester}
                    </div>
                  </div>
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
