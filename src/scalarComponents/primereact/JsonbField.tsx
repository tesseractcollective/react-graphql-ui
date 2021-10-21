import React, { FunctionComponent } from 'react';
import { bs } from '@tesseractcollective/react-graphql';
import { ScalarComponentPropsBase } from '../../types/generic';

export interface IJsonbFieldProps  extends ScalarComponentPropsBase {}

const JsonbField: FunctionComponent<IJsonbFieldProps> = function JsonbField(props) {

  return <div className="px-4 py-2 flex-1 justify-start items-stretch">JsonbField</div>;
};

export default JsonbField;