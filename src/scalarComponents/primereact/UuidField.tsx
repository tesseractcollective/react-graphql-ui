import React, { FunctionComponent } from 'react';
import { bs } from '@tesseractcollective/react-graphql';
import { ScalarComponentPropsBase } from '../../types/generic';

export interface IUuidFieldProps  extends ScalarComponentPropsBase {}

const UuidField: FunctionComponent<IUuidFieldProps> = function UuidField(props) {

  return <div className="px-4 py-2 flex-1 justify-start items-stretch">UuidField</div>;
};

export default UuidField;