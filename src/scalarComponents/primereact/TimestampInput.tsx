import { Calendar } from 'primereact/calendar'
import React, { FunctionComponent } from 'react'
import { useController } from 'react-hook-form'
import { ScalarComponentPropsBase } from '../../types/generic';
import LabelFor from './LabelFor'

export interface ITimestampInputProps extends ScalarComponentPropsBase {}

const TimestampInput: FunctionComponent<ITimestampInputProps> =
  function TimestampInput({ fieldInfo, control, rules, ...passthroughProps }) {
    
    const {
      field: { ref, ...inputProps },
      fieldState: { invalid, isTouched, isDirty, error },
      formState: { touchedFields, dirtyFields },
    } = useController({
      name: fieldInfo.name,
      control,
      rules,
      defaultValue: new Date(),
    })

    return (
      <div>
        <span className="p-float-label">
          <Calendar
            id={'ff-' + fieldInfo.name}
            ref={ref}
            {...inputProps}
            onChange={(e) => inputProps.onChange({ target: { value: e.value } })}
            className={`p-inputtext-sm w-full ${invalid ? 'p-invalid' : ''}`}
            {...passthroughProps}
          />
          <LabelFor fieldInfo={fieldInfo} />
        </span>
        <small id="username2-help" className="p-error p-d-block">{error?.message || error?.type}</small>
      </div>
    )
  }
export default TimestampInput
