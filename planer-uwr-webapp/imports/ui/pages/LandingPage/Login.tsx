import { Button, Card, Elevation } from '@blueprintjs/core';
import { Meteor } from 'meteor/meteor';
import React from 'react';

interface LoginProps {
  loggingIn: boolean;
}

export const Login = ({ loggingIn }: LoginProps) => {
  return (
    <Card elevation={Elevation.TWO}>
      <h2 style={{ textAlign: 'center', marginTop: 0 }}>
        <a href="#">Zaloguj się</a>
      </h2>
      <Button
        onClick={() => {
          Meteor.loginWithGithub({ requestPermissions: [] }, (err) => {
            if (err) {
              console.error(err);
            }
          });
        }}
        intent="primary"
        disabled={loggingIn}
      >
        Zaloguj przez GitHub
      </Button>
    </Card>
  );
};
