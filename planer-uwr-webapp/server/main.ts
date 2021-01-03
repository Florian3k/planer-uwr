import { Meteor } from 'meteor/meteor';
import { Courses } from '/imports/api/courses';
import { Plans } from '/imports/api/plans';
import { Rulesets } from '/imports/api/rulesets';
import { importCourses } from './import';
import '/imports/api/accounts';

const elseThrow = (message: string): never => {
  throw new Error(message);
};

Meteor.startup(async () => {
  if (Courses.find().count() === 0) {
    await importCourses();
  }
  if (Rulesets.find().count() === 0) {
    Rulesets.insert({
      name: 'Ruleset for testing',
      semesterCount: 7,
      rules: [],
    });
  }
  if (Plans.find().count() === 0) {
    Plans.insert({
      name: "Admin's plan for testing",
      ownerId:
        Meteor.users.findOne({ username: 'admin' })?._id ??
        elseThrow('Initial migration - admin not found!'),
      rulesetId:
        Rulesets.findOne()?._id ??
        elseThrow('Initial migration - ruleset not found!'),
      semesters: [],
    });
  }
});
