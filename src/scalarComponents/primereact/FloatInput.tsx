import React, { FunctionComponent } from 'react'
import { bs } from '@tesseractcollective/react-graphql'
import { ScalarComponentPropsBase } from '../../types/generic';
import GenericNumberInput from './GenericNumberInput'

export interface IFloatInputProps extends ScalarComponentPropsBase {}

const FloatInput: FunctionComponent<IFloatInputProps> = function FloatInput(
  props
) {
  return (
    <GenericNumberInput
      mode="decimal"
      {...props}
      inputNumberProps={{
        maxFractionDigits: 2,
        ...props
      }}
    />
  )
}

export default FloatInput
