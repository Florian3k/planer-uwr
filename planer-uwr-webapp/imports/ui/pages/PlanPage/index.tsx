import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import React from 'react';
import { useParams } from 'react-router-dom';

import { Courses } from '/imports/api/courses';
import { Offers } from '/imports/api/offers';
import { Plans } from '/imports/api/plans';

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

  const offers = useTracker(() => {
    Meteor.subscribe('offers');
    return Offers.find().fetch();
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
      <div style={{ display: 'flex' }}>
        <div>
          {courses.map(course => (
            <div key={course._id}>
              {course.name} - {course.semester}
            </div>
          ))}
        </div>
        <div>
          {offers.map(offer => (
            <div key={offer._id}>
              {offer.name} - {offer.status}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
