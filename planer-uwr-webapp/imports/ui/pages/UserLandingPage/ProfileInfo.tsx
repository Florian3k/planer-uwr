import { Button, Card, Elevation } from '@blueprintjs/core';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import React from 'react';

export const ProfileInfo = () => {
  const user = useTracker(() => Meteor.user());
  if (!user) {
    return null;
  }
  return (
    <Card
      elevation={Elevation.TWO}
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img
          src={`https://github.com/${user.username}.png?size=64`}
          style={{ borderRadius: 32, marginRight: 16 }}
          width={64}
          height={64}
        />
        <h2>Witaj {user.username}</h2>
      </div>
      <Button
        style={{ alignSelf: 'flex-end' }}
        intent="primary"
        onClick={() => Meteor.logout()}
      >
        Wyloguj
      </Button>
    </Card>
  );
};
