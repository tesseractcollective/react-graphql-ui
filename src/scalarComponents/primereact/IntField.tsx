import React, { FunctionComponent } from 'react';
import { bs } from '@tesseractcollective/react-graphql';
import { ScalarComponentPropsBase } from '../../types/generic';

export interface IIntFieldProps  extends ScalarComponentPropsBase {}

const IntField: FunctionComponent<IIntFieldProps> = function IntField(props) {

  return <div className="px-4 py-2 flex-1 justify-start items-stretch">IntField</div>;
};

export default IntField;