import {
  HasuraDataConfig,
  IFieldOutputType,
  useReactGraphql,
} from '@tesseractcollective/react-graphql'
import Case from 'case'
import { GraphQLEnumValue } from 'graphql'
import { Dropdown, DropdownProps } from 'primereact/dropdown'
import React, { FunctionComponent, useEffect, useMemo, useState } from 'react'
import { RegisterOptions, useController } from 'react-hook-form'

export interface SelectViaRelationshipProps {
  name: string
  value?: string
  onSelect?: (selectedItem: any) => void
  configForRelationship: HasuraDataConfig
  relationshipColumnNameForLabel: string
  relationshipColumnNameForValue: string
  autoSave?: boolean
  wrapperClassName?: string
  styles?: {
    containerStyle?: any | Readonly<any>
    menuStyle?: any | Readonly<any>
    itemStyle?: any | Readonly<any>
    itemActiveStyle?: any | Readonly<any>
  }
  where?: any
  control: any
  rules?: Omit<
    RegisterOptions,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >
  dropdownProps?: DropdownProps
  fieldInfo?: IFieldOutputType
}

const SelectViaRelationship: FunctionComponent<SelectViaRelationshipProps> =
  function SelectViaRelationship(props) {
    const {
      name,
      configForRelationship,
      relationshipColumnNameForLabel,
      relationshipColumnNameForValue,
      fieldInfo,
      autoSave,
      styles,
      control,
      where,
      dropdownProps,
      rules,
      ...rest
    } = props

    const [whereClause, setwhereClause] = useState()

    const {
      field: { ref, onChange, ...inputProps },
      fieldState: { invalid, isTouched, isDirty, error },
      formState: { touchedFields, dirtyFields },
    } = useController({
      name: name,
      control,
      rules,
      defaultValue: props.value || '',
    })

    const [query, setQuery] = useState<string>('')

    useEffect(() => {
      let wc = {
        ...where,
      }
      if (!!query) {
        wc[relationshipColumnNameForLabel] = { _ilike: `%${query}%` }
      }
      setwhereClause(wc)
    }, [query, where])

    const dataApi = useReactGraphql(configForRelationship)
    const queryState = dataApi.useInfiniteQueryMany({
      pageSize: 1000,
      where: whereClause,
      pause: fieldInfo?.enumValues ? true : false,
      ...rest,
    })

    const options = useMemo(() => {
      if (queryState.items.length) {
        return queryState.items?.map?.((itm: any) => {
          return {
            value: itm?.[relationshipColumnNameForValue as any],
            label: itm?.[relationshipColumnNameForLabel as any],
          }
        })
      } else if (fieldInfo?.enumValues) {
        return fieldInfo?.enumValues?.map?.((itm: GraphQLEnumValue) => {
          return {
            value: itm.value,
            label: itm.description || itm.name,
          }
        })
      }
    }, [queryState.items.length, fieldInfo?.enumValues])

    return (
      <div className={props?.wrapperClassName}>
        <span className={`p-float-label`} style={props.styles?.containerStyle}>
          <Dropdown
            ref={ref}
            {...inputProps}
            onChange={(e) => {
              if (props.onSelect) {
                props.onSelect(e.value)
              }
              onChange({ target: { value: e.value } })
            }}
            filter
            filterBy="label"
            showClear
            options={options}
            className={`w-full ${invalid ? 'p-invalid' : ''}`}
            {...dropdownProps}
          />
          <label htmlFor={'ff-' + name}>{Case.sentence(name)}</label>
        </span>
        <small id="username2-help" className="p-error p-d-block">
          {error?.message || error?.type}
        </small>
      </div>
    )
  }

export default SelectViaRelationship
