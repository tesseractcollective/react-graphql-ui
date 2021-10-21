import React, { FunctionComponent } from 'react';
import { bs } from '@tesseractcollective/react-graphql';
import { ScalarComponentPropsBase } from '../../types/generic';

export interface IStringFieldProps  extends ScalarComponentPropsBase {}

const StringField: FunctionComponent<IStringFieldProps> = function StringField(props) {

  return <div className="px-4 py-2 flex-1 justify-start items-stretch">StringField</div>;
};

export default StringField;