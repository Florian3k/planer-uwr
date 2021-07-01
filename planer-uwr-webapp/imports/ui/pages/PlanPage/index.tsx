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
import { SemestersWrapper } from './Semester/SemestersWrapper';
import { Rulesets } from '../../../api/rulesets';
import { RulesetSummary } from './RulesetSummary';

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

  const [ruleset, rulesetReady] = useTracker(() => {
    const sub = Meteor.subscribe('rulesets');
    return [Rulesets.findOne(plan?.rulesetId), sub.ready()] as const;
  }, [plan?.rulesetId]);

  const [showTrash, setShowTrash] = useState(false);

  const coursesReady = useTracker(() => {
    return Meteor.subscribe('courses').ready();
  }, []);

  const allCourses = useTracker(() => {
    return Object.fromEntries(
      Courses.find()
        .fetch()
        .map((course) => [course.id, course]),
    );
  }, []);

  if (!planReady || !coursesReady || !rulesetReady) {
    return <div>Wczytywanie planu...</div>;
  }

  if (!localPlan || !plan || !ruleset) {
    return <div>Nie znaleziono planu :(</div>;
  }

  return (
    <div
      style={{
        padding: 10,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        display: 'grid',
        gridTemplateRows: 'auto 1fr 200px',
      }}
    >
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
        <ListingWrapper showTrash={showTrash} />
        <div
          style={{
            overflowX: 'scroll',
            // Chrome doesn't support display: subgrid :'(
            // display: 'subgrid',
            gridRow: '1 / span 2',
            display: 'grid',
            gridTemplateRows: 'auto 1fr',
          }}
        >
          <SemestersWrapper
            courses={allCourses}
            semesters={localPlan.semesters}
          />
        </div>
        <RulesetSummary ruleset={ruleset} plan={localPlan} />
      </DragDropContext>
    </div>
  );
};
