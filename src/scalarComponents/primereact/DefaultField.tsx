import React, { FunctionComponent } from 'react';
import { bs } from '@tesseractcollective/react-graphql';
import { ScalarComponentPropsBase } from '../../types/generic';

export interface IDefaultFieldProps extends ScalarComponentPropsBase  {}

const DefaultField: FunctionComponent<IDefaultFieldProps> = function DefaultField(props) {

  return <div className="px-4 py-2 flex-1 justify-start items-stretch">DefaultField</div>;
};

export default DefaultField;