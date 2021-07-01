import { Meteor } from 'meteor/meteor';
import { Courses } from '/imports/api/courses';
import { Plans } from '/imports/api/plans';
import { Rulesets } from '/imports/api/rulesets';
import { importCourses } from './import';
import '/imports/api/accounts';
import { bachelorRules, engineeringRules } from './rules';

const elseThrow = (message: string): never => {
  throw new Error(message);
};

Meteor.startup(async () => {
  if (Courses.find().count() === 0) {
    await importCourses();
  }
  if (Rulesets.find().count() < 2) {
    Rulesets.insert({
      name: 'Licencjackie od 2019/2020',
      semesterCount: 6,
      rules: bachelorRules,
    });
    Rulesets.insert({
      name: 'Inżynierskie od 2019/2020',
      semesterCount: 7,
      rules: engineeringRules,
    });
  }
  if (Plans.find().count() === 0) {
    Plans.insert({
      name: "Admin's plan for testing",
      ownerId:
        Meteor.users.findOne({ username: 'admin' })?._id ??
        elseThrow('Initial migration - admin not found!'),
      rulesetId:
        Rulesets.findOne({ name: 'Inżynierskie od 2019/2020' })?._id ??
        elseThrow('Initial migration - ruleset not found!'),
      semesters: Array.from({ length: 7 }).map((_x, i) => ({
        semesterNumber: i + 1,
        isGap: false,
        courses: [],
      })),
      customCourses: [],
      nextCustomId: 1,
    });
  }
});
