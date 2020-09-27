import { Button, Card, Elevation } from '@blueprintjs/core';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import React from 'react';
import { Link } from 'react-router-dom';
import { Plans } from '../../../api/plans';

export const UserPlans = () => {
  const plans = useTracker(() => {
    Meteor.subscribe('plans');
    return Plans.find().fetch();
  });

  return (
    <Card elevation={Elevation.TWO}>
      <h2 style={{ textAlign: 'center', marginTop: 0 }}>Twoje plany</h2>
      {plans.map(plan => (
        <Link to={'/plan/' + plan._id} key={plan._id}>
          <Card>
            <h3>{plan.name}</h3>
          </Card>
        </Link>
      ))}
    </Card>
  );
};
