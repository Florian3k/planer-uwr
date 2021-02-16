import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

import { Course, Courses } from '/imports/api/courses';
import {
  addCourse,
  addCourseImpl,
  moveCourse,
  moveCourseImpl,
  Plan,
  Plans,
} from '/imports/api/plans';
import { Listing } from './Listing';
import { CourseWrapper } from './CourseWrapper';
import { Mongo } from 'meteor/mongo';
import { HTMLSelect } from '@blueprintjs/core';

const semestersNames = [
  'Oferta',
  '2020/21 letni',
  '2020/21 zimowy',
  '2019/20 letni',
  '2019/20 zimowy',
  '2018/19 letni',
  '2018/19 zimowy',
  '2017/18 letni',
  '2017/18 zimowy',
  '2016/17 letni',
  '2016/17 zimowy',
  '2015/16 letni',
  '2015/16 zimowy',
  '2014/15 letni',
  '2014/15 zimowy',
  '2013/14 letni',
  '2013/14 zimowy',
  '2012/13 letni',
  '2012/13 zimowy',
];

export const PlanPage = () => {
  const { planId } = useParams();

  const [localPlan, setLocalPlan] = useState<Plan | undefined>(undefined);

  const [plan, planReady] = useTracker(() => {
    const sub = Meteor.subscribe('plans');
    const plan = Plans.findOne(planId);
    if (plan) {
      setLocalPlan(plan);
    }
    return [plan, sub.ready()];
  }, []);

  const [filter, setFilter] = useState('');
  const [sourceSemester, setSourceSemester] = useState(semestersNames[0]);

  const courses = useTracker(() => {
    Meteor.subscribe('courses');
    const selector: Mongo.Selector<Course> = {
      name: { $regex: filter, $options: 'i' },
    };
    if (sourceSemester !== semestersNames[0]) {
      selector.semester = sourceSemester;
      selector.source = 'courses';
    } else {
      selector.source = 'offer';
    }
    return Courses.find(selector).fetch();
  }, [filter, sourceSemester]);

  if (!planReady) {
    return <div>Wczytywanie planu...</div>;
  }

  if (!localPlan || !plan) {
    console.log({ localPlan, plan });
    return <div>Nie znaleziono planu :(</div>;
  }

  return (
    <div>
      <div>Nazwa: {localPlan.name}</div>
      <div>Liczba semestrów: {localPlan.semesters.length}</div>
      <input
        className="bp3-input"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filtruj przedmioty"
      />
      <HTMLSelect
        value={sourceSemester}
        options={semestersNames}
        onChange={(e) => setSourceSemester(e.target.value)}
      />
      <br />
      <DragDropContext
        onDragEnd={(result, provided) => {
          if (!result.destination) {
            return;
          }
          const toColumn = parseInt(result.destination.droppableId);
          const toIndex = result.destination.index;
          if (result.source.droppableId === 'listing') {
            const course = Courses.findOne(result.draggableId.split('-')[1])!;
            const newPlan = addCourseImpl(plan, course, toColumn, toIndex);
            if (newPlan) {
              setLocalPlan(newPlan);
            }
            addCourse.call({
              planId,
              courseId: course._id!,
              toColumn,
              toIndex,
            });
          } else {
            console.log(result, provided);
            const fromColumn = parseInt(result.source.droppableId);
            const fromIndex = result.source.index;

            const newPlan = moveCourseImpl(
              plan,
              fromColumn,
              toColumn,
              fromIndex,
              toIndex,
            );
            if (newPlan) {
              setLocalPlan(newPlan);
            }
            moveCourse.call({
              planId,
              fromColumn,
              toColumn,
              fromIndex,
              toIndex,
            });
          }
        }}
      >
        <div style={{ display: 'flex' }}>
          <Listing courses={courses} />
          {localPlan.semesters.map((semester, semesterIndex) => (
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
