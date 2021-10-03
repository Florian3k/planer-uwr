import { Meteor } from 'meteor/meteor';

import { Courses } from '/imports/api/courses';
import { Rulesets } from '/imports/api/rulesets';
import '/imports/api/accounts';
import '/imports/api/plans';

import { importCourses } from './import';
import { bachelorRules, engineeringRules } from './rules';

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
});
