import { Editor } from 'primereact/editor';
import React, { FunctionComponent } from 'react';
import { useController } from 'react-hook-form';
import { ScalarComponentPropsBase } from '../../types/generic';
import LabelFor from './LabelFor';

export interface IRichTextInputProps extends ScalarComponentPropsBase {
  helpText?: string;
}

const RichTextInput: FunctionComponent<IRichTextInputProps> = function RichTextInput({
  fieldInfo,
  control,
  rules,
  ...passthroughProps
}: IRichTextInputProps) {
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

  const toolbarHeader = (
    <span className="ql-formats">
      <select className="ql-size" aria-label="Size" defaultValue="normal">
        <option label="Small" value="small" />
        <option label="Normal" value="normal" />
        <option label="Large" value="large" />
      </select>
      <button className="ql-bold" aria-label="Bold"></button>
      <button className="ql-italic" aria-label="Italic"></button>
      <button className="ql-underline" aria-label="Underline"></button>
      <button className="ql-strike" aria-label="Strike"></button>
      <button className="ql-link" aria-label="Link"></button>
      <button className="ql-blockquote" aria-label="Blockquote"></button>
      <button className="ql-list" value="ordered" aria-label="Ordered List"></button>
      <button className="ql-list" value="bullet" aria-label="Unordered List"></button>
      <button className="ql-align" aria-label="Align"></button>
    </span>
  );

  const inputComponent = (
    <Editor
      id={'ff-' + fieldInfo.name}
      ref={ref}
      {...inputProps}
      // need to manually trigger the onChange from onTextChange
      onTextChange={(e) => inputProps.onChange(e.htmlValue)}
      // HACK: There is currently (afaik) no easy way to detect the focus event
      // for the Editor component, meaning the floatlabel won't work correctly
      // setting this class is a hack to force the float label to always appear
      // as though the wrapper has been filled to have the proper style
      className={'p-inputwrapper-filled'}
      // This changes what buttons are displayed to change formatting
      headerTemplate={toolbarHeader}
      // This format will allow you to paste with those formats even if there's no
      // button for them in the toolbar
      formats={[
        'bold',
        'font',
        'color',
        'italic',
        'link',
        'size',
        'strike',
        'underline',
        'blockquote',
        'header',
        'indent',
        'list',
        'align',
        'direction',
      ]}
      {...passthroughProps}
    />
  );

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

export default RichTextInput;
