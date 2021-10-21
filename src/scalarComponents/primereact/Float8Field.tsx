import React, { FunctionComponent } from 'react';
import { bs } from '@tesseractcollective/react-graphql';
import { ScalarComponentPropsBase } from '../../types/generic';

export interface IFloat8FieldProps extends ScalarComponentPropsBase  {}

const Float8Field: FunctionComponent<IFloat8FieldProps> = function Float8Field(props) {

  return <div className="px-4 py-2 flex-1 justify-start items-stretch">Float8Field</div>;
};

export default Float8Field;