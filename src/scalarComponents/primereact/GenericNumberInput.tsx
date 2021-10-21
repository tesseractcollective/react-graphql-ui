import React, { FunctionComponent } from 'react'
import { useController } from 'react-hook-form'
import { ScalarComponentPropsBase } from '../../types/generic';
import { InputNumber, InputNumberProps } from 'primereact/inputnumber'
import Case from 'case'
import LabelFor from './LabelFor'

export interface IGenericNumberInputProps extends ScalarComponentPropsBase {
  inputNumberProps?: InputNumberProps
  mode: 'decimal' | 'currency'
}

const GenericNumberInput: FunctionComponent<IGenericNumberInputProps> =
  function GenericNumberInput({ fieldInfo, control, mode, rules, inputNumberProps }) {
    const {
      field: { ref, onChange, ...inputControllerProps },
      fieldState: { invalid, isTouched, isDirty, error },
      formState: { touchedFields, dirtyFields },
    } = useController({
      name: fieldInfo.name,
      control,
      rules,
      defaultValue: null,
    })

    return (
      <div>
        <div className="p-float-label">
          <InputNumber
            id={'ff-' + fieldInfo.name}
            ref={ref}
            onChange={(e)=> {
              onChange({target: {value: e.value}})
            }}
            {...inputControllerProps}
            className="p-inputtext-sm w-full"
            mode={mode}
            {...inputNumberProps}
          />
          <LabelFor fieldInfo={fieldInfo} />
        </div>
        <small id="username2-help" className="p-error p-d-block">{error?.message || error?.type}</small>
      </div>
    )
  }

export default GenericNumberInput
