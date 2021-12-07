import React, { FunctionComponent } from 'react'
import { ScalarComponentPropsBase } from '../../types/generic';
import NumberInput from './NumberInput'

export interface IIntInputProps extends ScalarComponentPropsBase {}

const IntInput: FunctionComponent<IIntInputProps> = function IntInput(props) {
  return <NumberInput mode="decimal" {...props} 
  inputNumberProps={{
    ...props
  } as any}/>
}

export default IntInput
