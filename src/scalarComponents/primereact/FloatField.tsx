import React, { FunctionComponent } from 'react';
import { bs } from '@tesseractcollective/react-graphql';
import { ScalarComponentPropsBase } from '../../types/generic';

export interface IFloatFieldProps extends ScalarComponentPropsBase  {}

const FloatField: FunctionComponent<IFloatFieldProps> = function FloatField(props) {

  return <div className="px-4 py-2 flex-1 justify-start items-stretch">FloatField</div>;
};

export default FloatField;