import React, { FunctionComponent } from 'react'
import { bs } from '@tesseractcollective/react-graphql'
import { ScalarComponentPropsBase } from '../../types/generic';
import { Checkbox, CheckboxProps } from 'primereact/checkbox'
import { useController } from 'react-hook-form'

export interface IBooleanInputProps extends ScalarComponentPropsBase {
  inputProps?: CheckboxProps
}

const BooleanInput: FunctionComponent<IBooleanInputProps> =
  function BooleanInput(props) {
    const { fieldInfo, control, inputProps, rules, ...passthroughProps } = props
    const {
      field: { ref, onChange, ...inputControllerProps },
      fieldState: { invalid, isTouched, isDirty, error },
      formState: { touchedFields, dirtyFields },
    } = useController({
      name: fieldInfo.name,
      control,
      rules,
      defaultValue: '',
    })

    return (
      <div>
        <Checkbox
          id={'ff-' + fieldInfo.name}
          ref={ref}
          onChange={(e) => {
            onChange({target: {value: e.value}})
          }}
          {...inputControllerProps}
          {...inputProps}
          {...passthroughProps}
        />
        <small id="username2-help" className="p-error p-d-block">{error?.message || error?.type}</small>
      </div>
    )
  }

export default BooleanInput
