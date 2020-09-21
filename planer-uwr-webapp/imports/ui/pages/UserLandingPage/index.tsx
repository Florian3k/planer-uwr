import React from 'react';
import { CreatePlan } from './CreatePlan';
import { ProfileInfo } from './ProfileInfo';
import { UserPlans } from './UserPlans';

export const UserLandingPage = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        height: '90vh',
      }}
    >
      <UserPlans />
      <CreatePlan />
      <ProfileInfo />
    </div>
  );
};
