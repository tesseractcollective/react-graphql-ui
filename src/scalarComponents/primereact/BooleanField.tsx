import React, { FunctionComponent } from 'react';
import { bs } from '@tesseractcollective/react-graphql';
import { ScalarComponentPropsBase } from '../../types/generic';

export interface IBooleanFieldProps extends ScalarComponentPropsBase  {}

const BooleanField: FunctionComponent<IBooleanFieldProps> = function BooleanField(props) {

  return <div className="px-4 py-2 flex-1 justify-start items-stretch">BooleanField</div>;
};

export default BooleanField;