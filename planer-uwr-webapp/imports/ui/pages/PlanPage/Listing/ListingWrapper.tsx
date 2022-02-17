import { HTMLSelect } from '@blueprintjs/core';
import { Mongo } from 'meteor/mongo';
import { useTracker } from 'meteor/react-meteor-data';
import React, { useState } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { useDebounce } from 'use-debounce';

import { CourseWrapper } from '../CourseWrapper';
import { Course, Courses } from '/imports/api/courses';

const semestersNames = [
  'Oferta',
  '2021/22 letni',
  '2021/22 zimowy',
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

interface ListingWrapperProps {
  showTrash: boolean;
}

export const ListingWrapper = ({ showTrash }: ListingWrapperProps) => {
  const [filter, setFilter] = useState('');
  const [filterDebounced] = useDebounce(filter, 100);
  const [sourceSemester, setSourceSemester] = useState(semestersNames[0]);

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

  return (
    <>
      <div style={{ gridRow: 1, width: 300 }}>
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
      </div>
      <div
        style={{
          gridRow: 2,
          width: 300,
          position: 'relative',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        <Droppable droppableId="trash" isDropDisabled={!showTrash}>
          {(provided) => (
            <div
              style={{
                position: 'absolute',
                background: 'rgba(255, 0, 0, 0.5)',
                width: 300,
                height: 300,
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
        <Droppable droppableId="listing" isDropDisabled>
          {(provided) => (
            <div
              style={{
                width: 300,
                border: '1px solid green',
                height: '100%',
                overflowY: 'scroll',
                overflowX: 'hidden',
              }}
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
                      {snapshot.isDragging && <CourseWrapper course={course} />}
                    </>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </>
  );
};
