import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import React from 'react';
import { useParams } from 'react-router-dom';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

import { Courses } from '/imports/api/courses';
import { Plans } from '/imports/api/plans';
import { Listing } from './Listing';
import { CourseWrapper } from './CourseWrapper';

export const PlanPage = () => {
  const { planId } = useParams();

  const [plan, planReady] = useTracker(() => {
    const sub = Meteor.subscribe('plans');
    return [Plans.findOne(planId), sub.ready()];
  });

  const courses = useTracker(() => {
    Meteor.subscribe('courses');
    return Courses.find().fetch();
  });

  if (!planReady) {
    return <div>Wczytywanie planu...</div>;
  }

  if (!plan) {
    return <div>Nie znaleziono planu :(</div>;
  }

  return (
    <div>
      <div>Nazwa: {plan.name}</div>
      <div>Liczba semestrów: {plan.semesters.length}</div>
      <br />
      <DragDropContext
        onDragEnd={(result, provided) => {
          console.log(result, provided);
        }}
      >
        <div style={{ display: 'flex' }}>
          <Listing courses={courses} />
          {plan.semesters.map((semester, semesterIndex) => (
            <div
              style={{ minWidth: 300, maxWidth: 350, flexGrow: 1 }}
              key={semesterIndex.toString()}
            >
              {semester.isGap ? (
                'wolne :)'
              ) : (
                <Droppable droppableId={semester.semesterNumber.toString()}>
                  {(provided, stateSnapshot) => (
                    <div
                      style={{ minHeight: 600, border: '1px solid blue' }}
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      <pre>{JSON.stringify(stateSnapshot, null, 2)}</pre>
                      {semester.courses.length ? (
                        semester.courses.map((course, courseIndex) => (
                          <Draggable
                            draggableId={`${semester.semesterNumber}-${courseIndex}-${course.id}`}
                            index={courseIndex}
                            key={`${course.id}${semester.semesterNumber}`}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <CourseWrapper course={course} />
                              </div>
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
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};
