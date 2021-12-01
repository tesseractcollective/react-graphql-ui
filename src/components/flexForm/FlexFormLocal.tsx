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

export interface FlexFormLocalProps {
  //If you have existing data for your fields like a "row" give it here, else empty object
  data?: any
  fields: FlexFormFieldOutputType[]
  hideFields?: string[]
  //If your data has any foreign keys or relationships, you'll need to supply the configs for those here.
  //IE - if you have an `amountType` that points to `amountTypes.type`. You'll need to pass in: {amountTypes: HasuraConfig.amountSelect} so that we can find the right relationship columns you want to use.
  //If you want to override which column is used for the value or the label Spread your config onto a new object and add in `relationshipMeta: {...}` to override the field
  //If you need to add a where clause to filter the options you can do so on relationshipMeta.defaultWhere
  configs?: {
    [typename: string]: HasuraDataConfig
  }
  // Coming soon: children?: ReactElement | Array<ReactElement>
  //Override any components used.  Key=fieldName Value=component.  IE - displayName: ()=> <MyOverride/>.
  //Recieved ScalarComponentPropsBase as props
  components?: Record<string, (props: ScalarComponentPropsBase) => ReactElement>
  //Add additional grid styles.  Component styling to be done in the individual components
  grid?: {
    styles?: string
    columnCount?: number
  }
  //Additional props that will be passed through to the field component
  props?: Record<
    string,
    {
      [key: string]: any
      rules?: Omit<
        RegisterOptions,
        'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
      >
    }
  >
  onDataFromGrid?: (data: any) => void
  control?: Control
  disableAllFields?: boolean
}

function FlexFormLocal(props: FlexFormLocalProps) {
  const rgUIContext = useContext<any>(ReactGraphqlUIContext)
  //Spread primary key onto initial variables for update
  const {
    fields: fieldsConfig,
    disableAllFields,
    configs,
    data: _data,
    onDataFromGrid,
    props: passthroughProps,
    control,
  } = props

  const data = useMemo(() => {
    // Grab a deep copy of _data. We want that to compare to the original if needed.
    let data = _data
    if (typeof _data === 'object' && !Array.isArray(_data)) {
      data = { ..._data }
    } else {
      return null
    }

    // PreProcess with some defaults. For instance if there's a timestamp field
    // the default preprocessing is to convert it into a Date object.
    // If that is undesirable a user can overrid that by providing a custom preprocess function to simply return the value
    for (const [datumName, datumValue] of Object.entries(_data)) {
      // const datumTypeName = fieldsConfig?.fieldSimpleMap?.[datumName]?.typeName
      const datumTypeName = fieldsConfig.find(
        (field: FlexFormFieldOutputType) => field.name === datumName
      )?.typeName

      // Convert timestamps to Date objects
      if (
        typeof datumValue === 'string' &&
        (datumTypeName === 'timestamp' || datumTypeName === 'timestamptz')
      ) {
        data[datumName] = new Date(datumValue)
      }
    }

    return data
  }, [_data])

  useEffect(() => {
    if (onDataFromGrid) {
      onDataFromGrid(data)
    }
  }, [data])

  const fieldsElements = useMemo(() => {
    const RelationshipInput =
      props.components?.RelationshipInput ||
      rgUIContext.defaultComponents['RelationshipInput']

    return fieldsConfig
      .filter((fieldInfo) => {
        // nothing to hide? keep it all!
        if (!props?.hideFields || props?.hideFields?.length < 1) {
          return true
        }
        // otherwise don't show stuff in this list
        return !props.hideFields.includes(fieldInfo.name)
      })
      .map((fieldInfo) => {
        const fieldTypePascal = Case.pascal(fieldInfo.typeName)
   
          
        

        const Component =
          props.components?.[fieldInfo.name] ||
          (fieldInfo.relationship && RelationshipInput) ||
          // @ts-ignore
          rgUIContext.defaultComponents[fieldTypePascal + 'Input']
        if (!Component) {
          console.warn(`Missing component for field: ${fieldInfo.name} and type ${fieldInfo.typeName}. 
          * Pass it in on props.components ={ ${fieldInfo.typeName}: <MyComponent />}
          * Export a component called ${fieldTypePascal}Input in defaultScalarComponents/index.tsx`)
        }

        const { rules, ...propsToPass } =
          passthroughProps?.[fieldInfo.name] ?? {}

        return (
          <Component
            key={'FF-' + fieldInfo.name}
            fieldInfo={fieldInfo}
            control={control}
            configs={configs}
            rules={{ required: fieldInfo.isNonNull, ...rules }}
            disabled={disableAllFields}
            {...propsToPass}
          />
        )
      })
  }, [fieldsConfig, configs])

  return (
    <div
      className={
        props.grid?.styles ||
        `grid grid-cols-${
          props.grid?.columnCount ?? '3'
        } gap-x-12 gap-y-8 justify-items-stretch`
      }
    >
      {...fieldsElements}
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
