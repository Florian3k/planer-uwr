import React from 'react';
import { courseTypeById, generalCourseTypes } from '../../../utils';
import CourseTypeTag from './CourseTypeTag';
import { BaseRule } from '/imports/api/rulesets';

const Separator = ({ value }: { value: string | number | boolean }) => {
    return (
        <span style={{ color: 'gray', margin: '0 5px' }}>{value}</span>
    );
};

interface RuleEntryProps {
    rule: BaseRule;
}

const RuleEntry = (props: RuleEntryProps) => {
    switch (props.rule.description) {
        case 'przedmioty informatyczne':
            return (
                <span>
                    <CourseTypeTag courseType={courseTypeById['5']} />
                    <Separator value="+" />
                    <CourseTypeTag courseType={courseTypeById['6']} />
                    <Separator value="+" />
                    <CourseTypeTag courseType={courseTypeById['7']} />
                </span>
            );
        case 'Projekt programistyczny':
            return (
                <span>
                    <CourseTypeTag courseType={courseTypeById['13']} />
                    <Separator value="" />
                </span>
            );
        case 'Łącznie przedmioty O + I + K + P':
            return (
                <span>
                    <CourseTypeTag courseType={generalCourseTypes['1']} />
                    <Separator value="+" />
                    <CourseTypeTag courseType={generalCourseTypes['2']} />
                    <Separator value="+" />
                    <CourseTypeTag courseType={generalCourseTypes['3']} />
                    <Separator value="+" />
                    <CourseTypeTag courseType={generalCourseTypes['4']} />
                </span>
            )
        case 'przedmioty informatyczne inż.':
            return (
                <span>
                    <CourseTypeTag courseType={courseTypeById['7']} />
                </span>
            );
        case 'Kursy inżynierskie':
            return (
                <span>
                    <CourseTypeTag courseType={courseTypeById['40']} />
                </span>
            );
        case 'Efekty kształcenia':
            return (
                <span>
                    <Separator value="∑ >=" />
                    <Separator value={props.rule.condition} />
                </span>
            );
        default:
            return <span/>
    }
};

export default RuleEntry;
