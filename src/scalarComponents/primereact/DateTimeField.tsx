import React, { FunctionComponent } from 'react';
import { bs } from '@tesseractcollective/react-graphql';
import { ScalarComponentPropsBase } from '../../types/generic';

export interface IDateTimeFieldProps extends ScalarComponentPropsBase  {}

const DateTimeField: FunctionComponent<IDateTimeFieldProps> = function DateTimeField(props) {

  return <div className="px-4 py-2 flex-1 justify-start items-stretch">DateTimeField</div>;
};

export default DateTimeField;