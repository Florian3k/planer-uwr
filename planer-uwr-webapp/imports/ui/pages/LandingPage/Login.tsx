import { Button, Card, Classes, Elevation, FormGroup } from '@blueprintjs/core';
import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';
import { isMeteorError } from '../../../utils';

interface LoginProps {
  loggingIn: boolean;
}

export const Login = ({ loggingIn }: LoginProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  return (
    <Card elevation={Elevation.TWO}>
      <h2 style={{ textAlign: 'center', marginTop: 0 }}>
        <a href="#">Zaloguj się</a>
      </h2>
      {error && (
        <div
          style={{ textAlign: 'center', marginBottom: '0.75em', color: 'red' }}
          className="bp3-form-helper-text"
        >
          {error}
        </div>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();

          if (!username || !password) {
            setError('Proszę wypełnić oba pola');
            return;
          }

          Meteor.loginWithPassword(username, password, (err) => {
            if (isMeteorError(err)) {
              if (err.reason === 'User not found') {
                setError('Nie znaleziono użytkownika');
              } else if (err.reason === 'Incorrect password') {
                setError('Nieprawidłowe hasło');
              }
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
            onChange={(e) => setUsername(e.target.value)}
          />
        </FormGroup>
        <FormGroup label="Hasło">
          <input
            className={Classes.INPUT}
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormGroup>
        <Button type="submit" intent="primary" disabled={loggingIn}>
          Zaloguj się
        </Button>
      </form>
    </Card>
  );
};
