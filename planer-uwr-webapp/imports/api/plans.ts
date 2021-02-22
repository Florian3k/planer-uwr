import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import * as z from 'zod';

import { ValidatedMethod } from '../method';
import { Course, Courses } from './courses';

export const courseEntrySchema = z.object({
  id: z.number().int(),
  source: z.union([
    z.literal('courses'),
    z.literal('offer'),
    z.literal('custom'),
  ]),
});

export type CourseEntry = z.infer<typeof courseEntrySchema>;

export const semesterSchema = z.union([
  z.object({
    semesterNumber: z.number(),
    isGap: z.literal(false),
    courses: z.array(courseEntrySchema),
  }),
  z.object({
    isGap: z.literal(true),
  }),
]);

export type Semester = z.infer<typeof semesterSchema>;

export const planSchema = z.object({
  name: z.string(),
  ownerId: z.string(),
  rulesetId: z.string(),
  semesters: z.array(semesterSchema),
});

export interface Plan extends z.infer<typeof planSchema> {
  _id?: string;
}

export const Plans = new Mongo.Collection<Plan>('plans');

if (Meteor.isServer) {
  Meteor.publish('plans', function () {
    return Plans.find({ ownerId: this.userId! });
  });
}

const indexSchema = z.number().int().nonnegative();

export const moveCourse = new ValidatedMethod({
  name: 'Plan.moveCourse',
  schema: z.object({
    planId: z.string(),
    fromColumn: indexSchema,
    toColumn: indexSchema,
    fromIndex: indexSchema,
    toIndex: indexSchema,
  }),
  run({ planId, fromColumn, toColumn, fromIndex, toIndex }) {
    const plan = Plans.findOne({
      _id: planId,
      ownerId: this.userId!,
    });

    if (!plan) {
      return;
    }

    if (moveCourseImpl(plan, fromColumn, toColumn, fromIndex, toIndex)) {
      Plans.update({ _id: planId }, plan);
    }
  },
});

export const addCourse = new ValidatedMethod({
  name: 'Plan.addCourse',
  schema: z.object({
    planId: z.string(),
    courseId: z.string(),
    toColumn: indexSchema,
    toIndex: indexSchema,
  }),
  run({ planId, courseId, toColumn, toIndex }) {
    const plan = Plans.findOne({
      _id: planId,
      ownerId: this.userId!,
    });

    const course = Courses.findOne(courseId);

    if (!plan || !course) {
      return;
    }

    if (addCourseImpl(plan, course, toColumn, toIndex)) {
      Plans.update({ _id: planId }, plan);
    }
  },
});

export const removeCourse = new ValidatedMethod({
  name: 'Plan.removeCourse',
  schema: z.object({
    planId: z.string(),
    fromColumn: indexSchema,
    fromIndex: indexSchema,
  }),
  run({ planId, fromColumn, fromIndex }) {
    const plan = Plans.findOne({
      _id: planId,
      ownerId: this.userId!,
    });

    if (!plan) {
      return;
    }

    if (removeCourseImpl(plan, fromColumn, fromIndex)) {
      Plans.update({ _id: planId }, plan);
    }
  },
});

export const moveCourseImpl = (
  plan: Plan,
  fromColumn: number,
  toColumn: number,
  fromIndex: number,
  toIndex: number,
) => {
  const from = plan.semesters.find(
    (sem) => !sem.isGap && sem.semesterNumber === fromColumn,
  );
  const to = plan.semesters.find(
    (sem) => !sem.isGap && sem.semesterNumber === toColumn,
  );
  if (
    !from ||
    from.isGap ||
    fromIndex >= from.courses.length ||
    !to ||
    to.isGap ||
    toIndex >= to.courses.length + 1
  ) {
    return;
  }

  if (fromColumn === toColumn) {
    const temp = to.courses[toIndex];
    to.courses[toIndex] = to.courses[fromIndex];
    to.courses[fromIndex] = temp;
    return plan;
  }

  to.courses.splice(toIndex, 0, from.courses.splice(fromIndex, 1)[0]);

  return plan;
};

export const addCourseImpl = (
  plan: Plan,
  course: Course,
  toColumn: number,
  toIndex: number,
) => {
  const to = plan.semesters.find(
    (sem) => !sem.isGap && sem.semesterNumber === toColumn,
  );
  if (!to || to.isGap || toIndex > to.courses.length) {
    return;
  }

  to.courses.splice(toIndex, 0, { id: course.id, source: course.source });

  return plan;
};

export const removeCourseImpl = (
  plan: Plan,
  fromColumn: number,
  fromIndex: number,
) => {
  const semester = plan.semesters[fromColumn - 1];

  if (!semester || semester.isGap) {
    return;
  }

  semester.courses.splice(fromIndex, 1);

  return plan;
};
