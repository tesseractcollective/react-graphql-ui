import React, { FunctionComponent } from 'react'
import TimestampInput from './TimestampInput'
import { ScalarComponentPropsBase } from '../../types/generic';

export interface IDateTimeInputProps extends ScalarComponentPropsBase {}

const DateTimeInput: FunctionComponent<IDateTimeInputProps> =
  function DateTimeInput(props) {
    return <TimestampInput {...props} />
  }

export default DateTimeInput
