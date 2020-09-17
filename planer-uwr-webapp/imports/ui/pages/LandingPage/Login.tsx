import { Button, Card, Classes, Elevation, FormGroup } from '@blueprintjs/core';
import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';

interface LoginProps {
  loggingIn: boolean;
}

export const Login = ({ loggingIn }: LoginProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <Card elevation={Elevation.TWO}>
      <h2 style={{ textAlign: 'center' }}>
        <a href="#">Zaloguj się</a>
      </h2>

      <form
        onSubmit={e => {
          e.preventDefault();
          Meteor.loginWithPassword(username, password, err => {
            if (err) {
              console.log(err);
            } else {
              setPassword('');
              setUsername('');
            }
          });
        }}
      >
        <FormGroup label="Login">
          <input
            className={Classes.INPUT}
            type="text"
            name="username"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </FormGroup>
        <FormGroup label="Hasło">
          <input
            className={Classes.INPUT}
            type="password"
            name="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </FormGroup>
        <Button type="submit" intent="primary" disabled={loggingIn}>
          Zaloguj się
        </Button>
      </form>
    </Card>
  );
};
