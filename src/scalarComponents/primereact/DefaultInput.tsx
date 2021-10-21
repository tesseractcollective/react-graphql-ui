import React, { FunctionComponent } from 'react';
import { bs } from '@tesseractcollective/react-graphql';
import { ScalarComponentPropsBase } from '../../types/generic';

export interface IDefaultInputProps extends ScalarComponentPropsBase  {}

const DefaultInput: FunctionComponent<IDefaultInputProps> = function DefaultInput(props) {

  return <input className="border" type="text"/>;
};

export default DefaultInput;