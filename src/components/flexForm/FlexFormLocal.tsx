import { getDefaultComponentForScalar } from '@/support/getDefaultComponentForScalar'
import { HasuraDataConfig } from '@tesseractcollective/react-graphql'
import Case from 'case'
import React, { ReactElement, useContext, useEffect, useMemo } from 'react'
import { Control, RegisterOptions } from 'react-hook-form'
import { ReactGraphqlUIContext } from '../../context/ReactGraphqlUIContext'
import {
  FlexFormFieldOutputType,
  ScalarComponentPropsBase,
} from '../../types/generic'
import useFlexFormLocal, { FlexFormLocalProps } from '../../hooks/flexForm/useFlexFormLocal'

function FlexFormLocal(props: FlexFormLocalProps) {
  const ffData = useFlexFormLocal(props)

  return (
    <div
      {...ffData.containerProps}
    >
      {...ffData.fieldsElements}
    </div>
  )
}

export default FlexFormLocal

//TODO: Support passing in own children
// const children: Array<ReactElement> = Array.isArray(
//   props.children as ReactElement | Array<ReactElement>
// )
//   ? (props.children as Array<ReactElement>)
//   : [props.children as ReactElement]

// const newChildren = children.map((child: ReactElement) => {
//   return React.cloneElement(child, { ...register })
// });

// config.fields?.fieldSimpleMap['abc']?.typeName;
// config.fields?.fieldTypeMap['abc']?.;
