import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import * as z from 'zod';

const baseSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  courseType: z.number().int(),
  recommendedForFirstYear: z.boolean(),
  owner: z.number().int(),
  effects: z.array(z.number().int()),
  tags: z.array(z.number().int()),
  url: z.string(),
  ects: z.transformer(z.string(), z.number().int(), (str) => parseInt(str)),
  hours: z.array(z.string()),
  exam: z.transformer(
    z.enum(['Yes', 'No']),
    z.boolean(),
    (str) => str === 'Yes',
  ),
});

export const courseSchema = z.union([
  baseSchema.merge(
    z.object({
      source: z.literal('courses'),
      semester: z.string(),
    }),
  ),
  baseSchema.merge(
    z.object({
      source: z.literal('offer'),
      status: z.enum(['IN_OFFER', 'IN_VOTE', 'WITHDRAWN']),
      semester: z.enum(['l', 'z', 'u']),
    }),
  ),
]);

export type Course = z.infer<typeof courseSchema> & {
  _id?: string;
};

export const Courses = new Mongo.Collection<Course>('courses');

if (Meteor.isServer) {
  Courses.rawCollection().createIndex({ id: 1 }, { unique: true });

  Meteor.publish('courses', function () {
    return Courses.find();
  });
}
