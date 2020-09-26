import { Meteor } from 'meteor/meteor';
import { Courses } from '/imports/api/courses';
import { Offers } from '/imports/api/offers';
import { importCourses, importOffers } from './import';
import '/imports/api/accounts';

Meteor.startup(async () => {
  if (Courses.find().count() === 0) {
    await importCourses();
  }
  if (Offers.find().count() === 0) {
    await importOffers();
  }
});
