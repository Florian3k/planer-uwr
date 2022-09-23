import { useTracker } from 'meteor/react-meteor-data';
import React from 'react';
import CourseEffectTag, { courseEffects } from './CourseEffectTag';
import RuleEntry from './RuleEntry';
import { Course, Courses } from '/imports/api/courses';
import { Plans } from '/imports/api/plans';
import { BaseRule, Ruleset } from '/imports/api/rulesets';

type RulesetSummaryProps = {
  ruleset: Ruleset;
  planId: string;
};

const filterCourses = (courses: Course[], rule: BaseRule) =>
  courses
    .filter((course) =>
      rule.selector.every((cond) => {
        const val = course[cond.field];
        if (Array.isArray(val)) {
          return val.some((v) => cond.value.includes(v));
        } else {
          return cond.value.includes(val);
        }
      }),
    )
    .reduce((acc, course) => acc + course.ects, 0);

export const RulesetSummary = ({ ruleset, planId }: RulesetSummaryProps) => {
  const [plan, courses] = useTracker(() => {
    const plan = Plans.findOne(planId);
    const courses = plan?.semesters
      .flatMap((sem) => (sem.isGap ? [] : sem.courses))
      .flatMap((course) =>
        course.source === 'custom' ? [] : [Courses.findOne({ id: course.id })!],
      );

    return [plan, courses];
  }, []);

  if (!plan || !courses) {
    return null;
  }

  return (
    <div style={{ border: '1px solid deeppink', gridColumn: '1 / span 1000', overflow: 'scroll' }}>
      <div>
        <div>{ruleset.name}</div>
        {ruleset.rules.map((rule, idx) => (
          <div
            key={ruleset._id + rule.name + idx}
            style={{ border: '1px solid maroon', padding: 4 }}
          >
            <RuleEntry rule={rule} />
            {filterCourses(courses, rule)}{' '}
            {filterCourses(courses, rule) >=
            (rule.condition === true ? 1 : rule.condition)
              ? 'GOOD'
              : 'BAD'}
            {rule.subRules &&
              rule.subRules.map((rule, idx) => {
                // <span
                //   key={ruleset._id + rule.name + idx}
                //   style={{ border: '1px solid maroon', padding: 4 }}
                // >
                //   <b>{rule.name}</b> {/* {filterCourses(courses, rule)} */}{' '}
                //   {filterCourses(courses, rule) >=
                //   (rule.condition === true ? 1 : rule.condition)
                //     ? 'GOOD'
                //     : 'BAD'}
                const ruleKey = courseEffects.reduce<number>((total, effect) => (
                  (!total && effect.value === rule.name) ? effect.key : total
                ), 0);
                return (
                  <span
                    key={ruleset._id + rule.name + idx}
                    style={{ border: '1px solid maroon', padding: 4 }}
                  >
                  <CourseEffectTag effects={[ruleKey]} />
                  {filterCourses(courses, rule) >=
                  (rule.condition === true ? 1 : rule.condition)
                    ? 'GOOD'
                    : 'BAD'}
                  </span>
                );
              })}
          </div>
        ))}
      </div>
    </div>
  );
};
