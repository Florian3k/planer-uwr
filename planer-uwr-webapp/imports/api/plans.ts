import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Random } from 'meteor/random';
import * as z from 'zod';

import { ValidatedMethod } from '../method';
import { shortNameByType } from '../utils';
import { Course, Courses } from './courses';
import { Rulesets } from './rulesets';

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

const customCourseSchema = z.object({
  _id: z.string(),
  id: z.number().int(),
  source: z.literal('custom'),
  name: z.string(),
  courseType: z.number().int(),
  effects: z.array(z.number().int()),
  ects: z.number().int(),
});

export type CustomCourse = z.infer<typeof customCourseSchema>;

export const planSchema = z.object({
  name: z.string(),
  ownerId: z.string(),
  rulesetId: z.string(),
  semesters: z.array(semesterSchema),
  customCourses: z.array(customCourseSchema),
  nextCustomId: z.number().int().nonnegative(),
});

export interface Plan extends z.infer<typeof planSchema> {
  _id?: string;
}

export const Plans = new Mongo.Collection<Plan>('plans');

if (Meteor.isServer) {
  Meteor.publish('plans', function () {
    return Plans.find({ ownerId: 'fakeid2137' });
  });
}

const indexSchema = z.number().int().nonnegative();

export const createPlan = new ValidatedMethod({
  name: 'Plans.createPlan',
  schema: z.object({
    rulesetId: z.string(),
    name: z.string().min(4).max(64),
  }),
  run({ rulesetId, name }) {
    // if (!this.userId) {
    //   return;
    // }

    const ruleset = Rulesets.findOne(rulesetId);
    if (!ruleset) {
      return;
    }

    return Plans.insert({
      name,
      ownerId: 'fakeid2137',
      rulesetId,
      semesters: Array.from({ length: ruleset.semesterCount }).map((_x, i) => ({
        semesterNumber: i + 1,
        isGap: false,
        courses: [],
      })),
      customCourses: [],
      nextCustomId: 1,
    });
  },
});

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
      ownerId: 'fakeid2137',
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
      ownerId: 'fakeid2137',
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
      ownerId: 'fakeid2137',
    });

    if (!plan) {
      return;
    }

    if (removeCourseImpl(plan, fromColumn, fromIndex)) {
      Plans.update({ _id: planId }, plan);
    }
  },
});

export const addCustomCourse = new ValidatedMethod({
  name: 'Plan.addCustomCourse',
  schema: z.object({
    planId: z.string(),
    name: z.string().nonempty().max(64),
    courseType: z.number().refine((type) => type in shortNameByType),
    ects: z.number().int().min(-100).max(100),
    effects: z.array(
      z
        .number()
        .int()
        .refine((effect) => ([] as unknown[]).includes(effect)), // TODO
    ),
  }),
  run({ planId, name, courseType, ects, effects }) {
    const plan = Plans.findOne({
      _id: planId,
      ownerId: 'fakeid2137',
    });

    if (!plan) {
      return;
    }
    const newCourse: CustomCourse = {
      _id: Random.id(),
      id: plan.nextCustomId,
      source: 'custom',
      name,
      courseType,
      ects,
      effects,
    };

    Plans.update(planId, {
      $inc: { nextCustomId: 1 },
      $push: {
        customCourses: newCourse,
      },
    });
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
