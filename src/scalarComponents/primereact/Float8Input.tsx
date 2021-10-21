import React, { FunctionComponent } from 'react'
import { bs } from '@tesseractcollective/react-graphql'
import GenericNumberInput from './GenericNumberInput'
import { ScalarComponentPropsBase } from '../../types/generic';

export interface IFloat8InputProps extends ScalarComponentPropsBase {}

const Float8Input: FunctionComponent<IFloat8InputProps> = function Float8Input(
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

export default Float8Input
