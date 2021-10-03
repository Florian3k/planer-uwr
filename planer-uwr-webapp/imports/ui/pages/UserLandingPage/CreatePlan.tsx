import { Button, Card, Classes, Elevation, FormGroup } from '@blueprintjs/core';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { createPlan } from '../../../api/plans';
import { Rulesets } from '../../../api/rulesets';

export const CreatePlan = () => {
  const [planName, setPlanName] = useState('');
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const navigate = useNavigate();

  const rulesets = useTracker(() => {
    Meteor.subscribe('rulesets');
    return Rulesets.find().fetch();
  });

  return (
    <Card elevation={Elevation.TWO}>
      <h2 style={{ textAlign: 'center', marginTop: 0 }}>Stwórz nowy plan</h2>
      <FormGroup label="Nazwa planu">
        <input
          className={Classes.INPUT}
          type="text"
          name="name"
          placeholder="Mój nowy plan"
          value={planName}
          minLength={4}
          maxLength={64}
          onChange={(e) => setPlanName(e.target.value)}
        />
      </FormGroup>
      <FormGroup label="Wybierz program studiów">
        {rulesets.map(({ name, semesterCount, _id }) => (
          <Card key={_id}>
            <h3>
              {name} - ({semesterCount} semestrów)
            </h3>
            <Button
              disabled={
                (_id !== loadingId && loadingId !== null) || planName.length < 4
              }
              loading={_id === loadingId}
              onClick={() => {
                setLoadingId(_id!);
                createPlan.call(
                  { name: planName, rulesetId: _id! },
                  (err, res) => {
                    setLoadingId(null);
                    if (err) {
                      console.error(err);
                    } else if (res) {
                      navigate(`/plan/${res}`);
                    }
                  },
                );
              }}
            >
              Wybierz
            </Button>
          </Card>
        ))}
      </FormGroup>
    </Card>
  );
};
