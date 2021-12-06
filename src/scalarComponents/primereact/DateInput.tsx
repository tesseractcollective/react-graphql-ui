import React, { FunctionComponent } from 'react';
import { ScalarComponentPropsBase } from '../../types/generic';
import TimestampInput from './TimestampInput';

export interface IDateInputProps extends ScalarComponentPropsBase {}

const DateInput: FunctionComponent<IDateInputProps> = function DateInput(props: IDateInputProps) {
  return <TimestampInput {...props} />;
};

export default DateInput;
