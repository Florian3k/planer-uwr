import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import React from 'react';
import { useParams } from 'react-router-dom';

import { Plans } from '/imports/api/plans';

export const PlanPage = () => {
  const { planId } = useParams();

  const [plan, planReady] = useTracker(() => {
    const sub = Meteor.subscribe('plans');
    return [Plans.findOne(planId), sub.ready()];
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
    </div>
  );
};
