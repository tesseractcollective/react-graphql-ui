import React, { FunctionComponent } from 'react'
import { ScalarComponentPropsBase } from '../../types/generic';
import TimestampInput from './TimestampInput'

export interface ITimestamptzInputProps extends ScalarComponentPropsBase {}

const TimestamptzInput: FunctionComponent<ITimestamptzInputProps> =
  function TimestamptzInput(props) {
    return <TimestampInput {...props} />
  }

export default TimestamptzInput
