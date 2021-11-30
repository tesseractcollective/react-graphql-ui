import { Checkbox, CheckboxProps } from 'primereact/checkbox';
import React, { FunctionComponent } from 'react';
import { useController } from 'react-hook-form';
import { ScalarComponentPropsBase } from '../../types/generic';

export interface IBooleanInputProps extends ScalarComponentPropsBase {
  /**
   * Props
   */
  inputProps?: CheckboxProps;
  /**
   * CSS Style objects per sub-component for detailed styling
   */
  styles?: {
    containerStyle?: any | Readonly<any>;
    checkboxLabelWrapperStyle?: any | Readonly<any>;
    labelStyle?: any | Readonly<any>;
    checkboxStyle?: any | Readonly<any>;
    errorStyle?: any | Readonly<any>;
  };

  /**
   * Styling via class names like tailwind or prime flex
   */
  checkboxLabelWrapperClassName?: string;
  containerClassName?: string;
  /**
   * Whether to put the label above, matching float labels for other prime react components (true)
   * Or to put it to the side (false)
   * Default: true
   */
  floatLabel?: boolean;
}

const BooleanInput: FunctionComponent<IBooleanInputProps> =
  function BooleanInput(props) {
    const {
      fieldInfo,
      control,
      inputProps,
      rules,
      floatLabel = true,
      ...passthroughProps
    } = props;
    const {
      field: { ref, onChange, ...inputControllerProps },
      fieldState: { invalid, isTouched, isDirty, error },
      formState: { touchedFields, dirtyFields },
    } = useController({
      name: fieldInfo.name,
      control,
      rules,
      defaultValue: false,
    });

    return (
      <div
        className={`p-field-checkbox ${passthroughProps?.containerClassName}`}
        style={passthroughProps?.styles?.containerStyle}
      >
        <div
          className={`${passthroughProps?.checkboxLabelWrapperClassName}`}
          style={passthroughProps?.styles?.checkboxLabelWrapperStyle}
        >
          <Checkbox
            id={'ff-' + fieldInfo.name}
            ref={ref}
            checked={inputControllerProps?.value}
            {...inputProps}
            onChange={(e) => {
              onChange(e.checked);
            }}
            {...inputControllerProps}
            {...passthroughProps}
            style={passthroughProps?.styles?.checkboxStyle ?? {}}
          />
          <label
            htmlFor={'ff-' + fieldInfo.name}
            style={
              passthroughProps?.styles?.labelStyle ?? floatLabel
                ? {
                    position: 'relative',
                    top: '-1.6rem',
                    fontSize: '12px',
                    color: '#6c757d',
                  }
                : {
                    paddingLeft: '1rem',
                  }
            }
          >
            {fieldInfo?.label ?? fieldInfo?.name}
          </label>
        </div>
        <small
          id="username2-help"
          className="p-error p-d-block"
          style={passthroughProps?.styles?.errorStyle}
        >
          {error?.message || error?.type}
        </small>
      </div>
    );
  };

export default BooleanInput;
