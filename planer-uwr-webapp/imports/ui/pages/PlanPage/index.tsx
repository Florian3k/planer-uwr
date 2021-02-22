import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import React, { useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { useParams } from 'react-router-dom';

import { Courses } from '/imports/api/courses';
import {
  addCourse,
  addCourseImpl,
  moveCourse,
  moveCourseImpl,
  Plan,
  Plans,
  removeCourse,
  removeCourseImpl,
} from '/imports/api/plans';
import { ListingWrapper } from './Listing/ListingWrapper';
import { SemesterWrapper } from './Semester/SemesterWrapper';

export const PlanPage = () => {
  const { planId } = useParams();

  const [localPlan, setLocalPlan] = useState<Plan | undefined>(undefined);

  const [plan, planReady] = useTracker(() => {
    const sub = Meteor.subscribe('plans');
    const plan = Plans.findOne(planId);
    if (plan) {
      setLocalPlan(plan);
    }
    return [plan, sub.ready()] as const;
  }, []) ?? [undefined, false];

  const [showTrash, setShowTrash] = useState(false);

  const coursesReady = useTracker(() => {
    return Meteor.subscribe('courses').ready();
  }, []);

  if (!planReady || !coursesReady) {
    return <div>Wczytywanie planu...</div>;
  }

  if (!localPlan || !plan) {
    return <div>Nie znaleziono planu :(</div>;
  }

  return (
    <div>
      <DragDropContext
        onDragStart={(initial) => {
          if (initial.source.droppableId !== 'listing') {
            setShowTrash(true);
          }
        }}
        onDragEnd={(result) => {
          setShowTrash(false);
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
            return addCourse.call({
              planId,
              courseId: course._id!,
              toColumn,
              toIndex,
            });
          }
          const fromColumn = parseInt(result.source.droppableId);
          const fromIndex = result.source.index;
          if (result.destination.droppableId === 'trash') {
            const newPlan = removeCourseImpl(plan, fromColumn, fromIndex);
            if (newPlan) {
              setLocalPlan(newPlan);
            }
            return removeCourse.call({ planId, fromColumn, fromIndex });
          }

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
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateRows: 'auto 1fr',
          }}
        >
          <ListingWrapper showTrash={showTrash} />
          {localPlan.semesters.map((semester, index) => (
            <SemesterWrapper semester={semester} key={index} />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};
