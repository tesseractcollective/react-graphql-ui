import React, { FunctionComponent } from 'react';
import { bs } from '@tesseractcollective/react-graphql';
import { ScalarComponentPropsBase } from '../../types/generic';

export interface IIDFieldProps  extends ScalarComponentPropsBase {}

const IDField: FunctionComponent<IIDFieldProps> = function IDField(props) {

  return <div className="px-4 py-2 flex-1 justify-start items-stretch">IDField</div>;
};

export default IDField;