import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import * as z from 'zod';

export const courseSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  courseType: z.number().int(),
  recommendedForFirstYear: z.boolean(),
  owner: z.number().int(),
  effects: z.array(z.number().int()),
  tags: z.array(z.number().int()),
  url: z.string(),
  ects: z.transformer(z.string(), z.number().int(), str => parseInt(str)),
  hours: z.array(z.string()),
  exam: z.transformer(z.enum(['Yes', 'No']), z.boolean(), str => str === 'Yes'),
  semester: z.string(),
});

export interface Course extends z.infer<typeof courseSchema> {
  _id?: string;
}

export const Courses = new Mongo.Collection<Course>('courses');

Courses.rawCollection().createIndex({ id: 1 }, { unique: true });

if (Meteor.isServer) {
  Meteor.publish('courses', function () {
    return Courses.find();
  });
}
