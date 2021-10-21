import React, { FunctionComponent } from 'react'
import { bs } from '@tesseractcollective/react-graphql'
import Case from 'case'
import { FlexFormFieldOutputType } from '../../types/generic'

export interface ILabelForProps {
  fieldInfo: FlexFormFieldOutputType
}

const LabelFor: FunctionComponent<ILabelForProps> = function LabelFor({
  fieldInfo,
}) {
  const fieldInfoNameSplit = fieldInfo.name.split('.')
  const fieldInfoName = fieldInfo.label || fieldInfoNameSplit[fieldInfoNameSplit.length - 1]

  return (
    <label htmlFor={'ff-' + fieldInfo.name}>
      {Case.sentence(fieldInfoName)}
    </label>
  )
}

export default LabelFor
