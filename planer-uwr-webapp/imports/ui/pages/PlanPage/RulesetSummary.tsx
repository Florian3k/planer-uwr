import { useTracker } from 'meteor/react-meteor-data';
import React from 'react';
import CourseEffectTag, { courseEffects } from './CourseEffectTag';
import RuleEntry from './RuleEntry';
import { Course, Courses } from '/imports/api/courses';
import { Plans } from '/imports/api/plans';
import { BaseRule, Ruleset } from '/imports/api/rulesets';

const bgColors: Record<string, string[]> = {
  'green': ['#375334', '#203420'],
  'red': ['#533434', '#342020']
}

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

  const is_passing = (rule: BaseRule) => filterCourses(courses, rule) >= (rule.condition === true ? 1 : rule.condition);
  const score_ratio = (rule: BaseRule) => `${filterCourses(courses, rule)} / ${(rule.condition === true ? '1' : rule.condition)}`;

  return (
    <div className='rule-row'>
      <div className='title'>{ruleset.name}</div>
      {ruleset.rules.map((rule, idx) => {
        // Get corresponding brightness variant with gievn color palette
        const rowBrightness = (colors: string[]) => (idx % 2 === 0)
          ? `${colors[idx % 2]}, #344653`
          : `${colors[idx % 2]}, #202B34`;
        // Get corresponding grandient background
        const rowBackground = is_passing(rule)
          ? `linear-gradient(90deg, ${rowBrightness(bgColors['green'])} 10%, transparent 70%)`
          : `linear-gradient(90deg, ${rowBrightness(bgColors['red'])} 10%, transparent 70%)`;
        // Get corresponding text color
        const rowColor = is_passing(rule)
          ? 'rgb(103, 214, 103)'
          : 'rgb(255, 74, 74)';
        return (
          <div
            key={ruleset._id + rule.name + idx}
            className='rule'
            style={{ background: rowBackground }}
          >
            <div className='score' style={{ color: rowColor }}>
              {score_ratio(rule)}
            </div>
            <div className='entry'>
              <RuleEntry rule={rule} />
            </div>
            {rule.subRules && rule.subRules.map((rule, idx) => {
                // Find key of the course effect
                const ruleKey = courseEffects.reduce<number>((total, effect) => (
                  (!total && effect.value === rule.name) ? effect.key : total), 0);
                const dotColor = is_passing(rule) ? 'rgb(103, 214, 103)' : 'rgb(255, 74, 74)';
                return (
                  <div
                    className='subrule-unit'
                    key={ruleset._id + rule.name + idx}
                  >
                    <CourseEffectTag effects={[ruleKey]} margin={0} />
                    <div className='subrule-dot' style={{ color: dotColor }}>
                      •
                    </div>
                  </div>
                );
              })}
          </div>
        )
      })}
    </div>
  );
};
