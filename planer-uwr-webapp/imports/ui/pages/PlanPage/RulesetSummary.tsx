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

  const isPassing = (rule: BaseRule) =>
    filterCourses(courses, rule) >=
    (rule.condition === true ? 1 : rule.condition);
  const scoreRatio = (rule: BaseRule) =>
    `${filterCourses(courses, rule)} / ${
      rule.condition === true ? '1' : rule.condition
    }`;

  return (
    <div className="rule-row">
      <div className="title">{ruleset.name}</div>
      {ruleset.rules.map((rule, idx) => {
        return (
          <div
            key={ruleset._id + rule.name + idx}
            className={`rule ${isPassing(rule) ? 'ticked' : ''}`}
          >
            <div className="score">{scoreRatio(rule)}</div>
            <div className="entry">
              <RuleEntry rule={rule} />
            </div>
            {rule.subRules &&
              rule.subRules.map((rule, idx) => {
                const ruleKey = courseEffects.reduce(
                  (total, effect) =>
                    !total && effect.value === rule.name ? effect.key : total,
                  0,
                );
                return (
                  <div
                    className="subrule-unit"
                    key={ruleset._id + rule.name + idx}
                  >
                    <CourseEffectTag
                      effects={[ruleKey]}
                      margin={0}
                      type={isPassing(rule) ? 'passing' : 'failing'}
                    />
                  </div>
                );
              })}
          </div>
        );
      })}
    </div>
  );
};
