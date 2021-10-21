import React, { FunctionComponent } from 'react';
import { bs } from '@tesseractcollective/react-graphql';
import { ScalarComponentPropsBase } from '../../types/generic';

export interface IBigintFieldProps  extends ScalarComponentPropsBase {}

const BigintField: FunctionComponent<IBigintFieldProps> = function BigintField(props) {

  return <div className="px-4 py-2 flex-1 justify-start items-stretch">BigintField</div>;
};

export default BigintField;