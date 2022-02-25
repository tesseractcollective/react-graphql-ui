import { InputMask } from 'primereact/inputmask';
import { InputText } from 'primereact/inputtext';
import React, { FunctionComponent } from 'react';
import { useController } from 'react-hook-form';
import { RichTextInput } from '.';
import { ScalarComponentPropsBase } from '../../types/generic';
import LabelFor from './LabelFor';
import { ToggleButton, ToggleButtonProps } from 'primereact/togglebutton';
import Case from 'case';

export interface IToggleInputProps extends ScalarComponentPropsBase {
  wrapperClassName?: string;
  label?: string;
  styles?: {
    containerStyle?: any | Readonly<any>;
    menuStyle?: any | Readonly<any>;
    itemStyle?: any | Readonly<any>;
    itemActiveStyle?: any | Readonly<any>;
  };
  options: { label: string; value: string }[];
  toggleButtonProps?: ToggleButtonProps;
}

const ToggleInput: FunctionComponent<IToggleInputProps> = ({
  fieldInfo,
  control,
  rules,
  label,
  wrapperClassName,
  styles,
  options,
  toggleButtonProps,
}) => {
  const {
    field: { ref, ...inputProps },
    fieldState: { invalid, isTouched, isDirty, error },
    formState: { touchedFields, dirtyFields },
  } = useController({
    name: fieldInfo.name,
    control,
    rules,
    defaultValue: '',
  });

  return (
    <div className={wrapperClassName}>
      <span className={`p-float-label`} style={styles?.containerStyle}>
        <ToggleButton
          ref={ref}
          {...inputProps}
          onIcon="pi pi-check"
          offIcon="pi pi-times"
          {...toggleButtonProps}
        />
      </span>
      <small id="username2-help" className="p-error p-d-block">
        {error?.message || error?.type}
      </small>
    </div>
  );
};

export default ToggleInput;
