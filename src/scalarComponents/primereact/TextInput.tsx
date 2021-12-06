import React, { FunctionComponent } from 'react';
import { ScalarComponentPropsBase } from '../../types/generic';
import StringInput from './StringInput';

export interface ITextInputProps extends ScalarComponentPropsBase {}

const TextInput: FunctionComponent<ITextInputProps> = function TextInput(props: ITextInputProps) {
  return <StringInput {...props} />;
};

export default TextInput;
