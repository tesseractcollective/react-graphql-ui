import { InputMask } from 'primereact/inputmask';
import { InputText } from 'primereact/inputtext';
import React, { FunctionComponent } from 'react';
import { useController } from 'react-hook-form';
import { RichTextInput } from '.';
import { ScalarComponentPropsBase } from '../../types/generic';
import LabelFor from './LabelFor';

export interface IStringInputProps extends ScalarComponentPropsBase {
  mask?: string;
  richText?: boolean;
  helpText?: string; // TODO: Should this go on ScalarComponentPropsBase for all types instead?
}

const StringInput: FunctionComponent<IStringInputProps> = (props: IStringInputProps) => {
  if (props.richText) {
    // This specifies what options are available to the user in the toolbar
    return <RichTextInput {...props} />;
  }
  return <StringInputInternal {...props} />
}

const StringInputInternal: FunctionComponent<IStringInputProps> = ({
  fieldInfo,
  control,
  mask,
  richText,
  rules,
  ...passthroughProps
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

  // default is input text, based on props it may be a different component
  let inputComponent = (
    <InputText
      id={'ff-' + fieldInfo.name}
      ref={ref}
      {...inputProps}
      className={`p-inputtext-sm w-full ${invalid ? 'p-invalid' : ''}`}
      {...passthroughProps}
    />
  );

  if (mask) {
    inputComponent = (
      <InputMask
        mask={mask}
        id={'ff-' + fieldInfo.name}
        ref={ref}
        {...inputProps}
        className="p-inputtext-sm w-full"
        {...passthroughProps}
      />
    );
  }

  return (
    <div className="">
      <div className="p-float-label">
        {inputComponent}
        <LabelFor fieldInfo={fieldInfo} />
      </div>
      <small id={'ff-' + fieldInfo.name + '-help'} className="p-d-block">
        {passthroughProps?.helpText}
      </small>
      <small id="username2-help" className="p-error p-d-block">
        {error?.message || error?.type}
      </small>
    </div>
  );
};

export default StringInput;
