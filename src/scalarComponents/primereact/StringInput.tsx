import { InputMask } from 'primereact/inputmask'
import { InputText } from 'primereact/inputtext'
import React, { FunctionComponent } from 'react'
import { useController } from 'react-hook-form'
import { ScalarComponentPropsBase } from '../../types/generic';
import LabelFor from './LabelFor'

export interface IStringInputProps extends ScalarComponentPropsBase {
  mask?: string
}

const StringInput: FunctionComponent<IStringInputProps> = function StringInput({
  fieldInfo,
  control,
  mask,
  rules,
  ...passthroughProps
}) {
  const {
    field: { ref, ...inputProps },
    fieldState: { invalid, isTouched, isDirty, error },
    formState: { touchedFields, dirtyFields },
  } = useController({
    name: fieldInfo.name,
    control,
    rules,
    defaultValue: '',
  })

  return (
    <div className="">
      <div className="p-float-label">
        {mask ? (
          <InputMask
            mask={mask}
            id={'ff-' + fieldInfo.name}
            ref={ref}
            {...inputProps}
            className="p-inputtext-sm w-full"
            {...passthroughProps}
          />
        ) : (
          <InputText
            id={'ff-' + fieldInfo.name}
            ref={ref}
            {...inputProps}
            className={`p-inputtext-sm w-full ${invalid ? 'p-invalid' : ''}`}
            {...passthroughProps}
          />
        )}
        <LabelFor fieldInfo={fieldInfo} />
      </div>
      <small id="username2-help" className="p-error p-d-block">
        {error?.message || error?.type}
      </small>
    </div>
  )
}

export default StringInput
