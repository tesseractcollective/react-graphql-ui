import React, { FunctionComponent } from 'react'
import { ScalarComponentPropsBase } from '../../types/generic';
import GenericNumberInput from './GenericNumberInput'

export interface IIntInputProps extends ScalarComponentPropsBase {}

const IntInput: FunctionComponent<IIntInputProps> = function IntInput(props) {
  return <GenericNumberInput mode="decimal" {...props} 
  inputNumberProps={{
    ...props
  } as any}/>
}

export default IntInput
