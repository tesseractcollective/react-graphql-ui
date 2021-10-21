import React, { FunctionComponent } from 'react';
import { ScalarComponentPropsBase } from '../../types/generic';

export interface IJsonbInputProps extends ScalarComponentPropsBase {
  address?: string;
}

const JsonbInput: FunctionComponent<IJsonbInputProps> = function JsonbInput(props) {
  return (
    <>
      Placeholder for JsonbInput. {props.fieldInfo.table}.{props.fieldInfo.name}
    </>
  );
};

export default JsonbInput;
