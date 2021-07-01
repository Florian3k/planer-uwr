import { useTracker } from 'meteor/react-meteor-data';
import React from 'react';
import { Course, Courses } from '/imports/api/courses';
import { Plan } from '/imports/api/plans';
import { BaseRule, Ruleset } from '/imports/api/rulesets';

type RulesetSummaryProps = {
  ruleset: Ruleset;
  plan: Plan;
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

export const RulesetSummary = ({ ruleset, plan }: RulesetSummaryProps) => {
  const courses = useTracker(() => {
    return plan.semesters
      .flatMap((sem) => (sem.isGap ? [] : sem.courses))
      .flatMap((course) =>
        course.source === 'custom' ? [] : [Courses.findOne({ id: course.id })!],
      );
  }, []);

  return (
    <div style={{ border: '1px solid deeppink', gridColumn: '1 / span 1000' }}>
      <div>
        <div>{ruleset.name}</div>
        {ruleset.rules.map((rule, idx) => (
          <div
            key={ruleset._id + rule.name + idx}
            style={{ border: '1px solid maroon', padding: 4 }}
          >
            <b>{rule.name}</b> {filterCourses(courses, rule)}
            {rule.subRules &&
              rule.subRules.map((rule, idx) => (
                <span
                  key={ruleset._id + rule.name + idx}
                  style={{ border: '1px solid maroon', padding: 4 }}
                >
                  <b>{rule.name}</b> {filterCourses(courses, rule)}
                </span>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};
