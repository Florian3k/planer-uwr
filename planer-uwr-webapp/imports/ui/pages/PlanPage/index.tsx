import { HTMLSelect } from '@blueprintjs/core';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { useTracker } from 'meteor/react-meteor-data';
import React, { useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { useParams } from 'react-router-dom';
import { useDebounce } from 'use-debounce';

import { Course, Courses } from '/imports/api/courses';
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
    return [plan, sub.ready()] as const;
  }, []) ?? [undefined, false];

  const [showTrash, setShowTrash] = useState(false);
  const [filter, setFilter] = useState('');
  const [filterDebounced] = useDebounce(filter, 100);
  const [sourceSemester, setSourceSemester] = useState(semestersNames[0]);

  const coursesReady = useTracker(() => {
    return Meteor.subscribe('courses').ready();
  }, []);

  const courses = useTracker(() => {
    const selector: Mongo.Selector<Course> = {
      name: {
        $regex: filterDebounced.replace(/[\\^$*+?.()|[\]{}]/g, '\\$&'),
        $options: 'i',
      },
    };
    if (sourceSemester !== semestersNames[0]) {
      selector.semester = sourceSemester;
      selector.source = 'courses';
    } else {
      selector.source = 'offer';
    }
    return Courses.find(selector, { limit: 20 }).fetch();
  }, [filterDebounced, sourceSemester]);

  if (!planReady || !coursesReady) {
    return <div>Wczytywanie planu...</div>;
  }

  if (!localPlan || !plan) {
    return <div>Nie znaleziono planu :(</div>;
  }

  return (
    <div>
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
        <div style={{ display: 'flex' }}>
          <ListingWrapper courses={courses} showTrash={showTrash} />
          {localPlan.semesters.map((semester, index) => (
            <SemesterWrapper semester={semester} key={index} />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};
