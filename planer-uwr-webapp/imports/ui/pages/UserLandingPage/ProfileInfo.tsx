import { Button, Card, Elevation } from '@blueprintjs/core';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import React from 'react';

export const ProfileInfo = () => {
  const user = useTracker(() => Meteor.user());
  return (
    <Card elevation={Elevation.TWO}>
      <h2 style={{ textAlign: 'center', marginTop: 0 }}>
        Witaj {user?.username}
      </h2>
      <Button intent="primary" onClick={() => Meteor.logout()}>
        Wyloguj
      </Button>
    </Card>
  );
};
