import React, { FunctionComponent } from 'react';
import { bs } from '@tesseractcollective/react-graphql';
import { ScalarComponentPropsBase } from '../../types/generic';

export interface IIDInputProps extends ScalarComponentPropsBase  {}

const IDInput: FunctionComponent<IIDInputProps> = function IDInput(props) {

  return <div className="px-4 py-2 flex-1 justify-start items-stretch">IDInput</div>;
};

export default IDInput;