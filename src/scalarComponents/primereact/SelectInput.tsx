import { InputMask } from 'primereact/inputmask';
import { InputText } from 'primereact/inputtext';
import React, { FunctionComponent } from 'react';
import { useController } from 'react-hook-form';
import { RichTextInput } from '.';
import { ScalarComponentPropsBase } from '../../types/generic';
import LabelFor from './LabelFor';
import { Dropdown, DropdownProps } from 'primereact/dropdown';
import Case from 'case';

export interface ISelectInputProps extends ScalarComponentPropsBase {
  wrapperClassName?: string;
  label?: string;
  styles?: {
    containerStyle?: any | Readonly<any>;
    menuStyle?: any | Readonly<any>;
    itemStyle?: any | Readonly<any>;
    itemActiveStyle?: any | Readonly<any>;
  };
  onSelect?: (selectedItem: any) => void;
  options: { label: string; value: string }[];
  dropdownProps?: DropdownProps;
}

const SelectInput: FunctionComponent<ISelectInputProps> = ({
  fieldInfo,
  control,
  rules,
  label,
  wrapperClassName,
  styles,
  onSelect,
  options,
  dropdownProps
}) => {
  const {
    field: { ref, onChange, ...inputProps },
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
        <Dropdown
          ref={ref}
          {...inputProps}
          onChange={(e) => {
            if (onSelect) {
              onSelect(e.value);
            }
            onChange({ target: { value: e.value } });
          }}
          filter
          filterBy="label"
          showClear
          options={options}
          className={`w-full ${invalid ? 'p-invalid' : ''}`}
          {...dropdownProps}
        />
        <label htmlFor={'ff-' + fieldInfo.name}>{label === undefined ? Case.sentence(fieldInfo.name) : label}</label>
      </span>
      <small id="username2-help" className="p-error p-d-block">
        {error?.message || error?.type}
      </small>
    </div>
  );
};

export default SelectInput;
