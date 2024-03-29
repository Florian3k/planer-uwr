import { HTMLSelect, Icon } from '@blueprintjs/core';
import { Mongo } from 'meteor/mongo';
import { useTracker } from 'meteor/react-meteor-data';
import React, { useState } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { useDebounce } from 'use-debounce';

import { CourseWrapper } from '../CourseWrapper';
import { Course, Courses } from '/imports/api/courses';

const semestersNames = [
  'Oferta',
  '2022/23 zimowy',
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
      <div className='listing-searchbar'>
        <input
          className="bp3-input"
          style={{ width: '45%', marginRight: 5 }}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filtruj przedmioty"
        />
        <HTMLSelect
          value={sourceSemester}
          options={semestersNames}
          style={{ display: 'inline-block' }}
          onChange={(e) => setSourceSemester(e.target.value)}
        />
      </div>
      <div className='listing-results'>
        <Droppable droppableId="listing" isDropDisabled>
          {(provided) => (
            <div
              className='listing-results-inner'
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <Droppable droppableId="trash" isDropDisabled={!showTrash}>
                {(provided) => (
                  <div
                    className='trash'
                    style={{ visibility: showTrash ? 'unset' : 'hidden' }}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <div className="trash-icon">
                      <Icon icon="trash" size={64} />
                      <div className="trash-title">Przeciągnij tutaj aby usunąć</div>
                    </div>
                    <div>{provided.placeholder}</div>
                  </div>
                )}
              </Droppable>
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
