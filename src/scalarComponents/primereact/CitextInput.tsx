import React, { FunctionComponent } from 'react'
import { ScalarComponentPropsBase } from '../../types/generic';
import StringInput from './StringInput'

export interface ICitextInputProps extends ScalarComponentPropsBase {}

const CitextInput: FunctionComponent<ICitextInputProps> = function CitextInput(
  props
) {
  return <StringInput {...props} />
}

export default CitextInput
