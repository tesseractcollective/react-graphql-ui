import React, { FunctionComponent } from 'react'
import { bs } from '@tesseractcollective/react-graphql'
import { ScalarComponentPropsBase } from '../../types/generic';

export interface IUuidInputProps extends ScalarComponentPropsBase {}

const UuidInput: FunctionComponent<IUuidInputProps> = function UuidInput(
  props
) {
  return (
    <div className="px-4 py-2 flex-1 justify-start items-stretch">
      UuidInput - {props.fieldInfo.name}
    </div>
  )
}

export default UuidInput
