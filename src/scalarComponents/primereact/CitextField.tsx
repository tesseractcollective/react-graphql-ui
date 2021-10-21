import React, { FunctionComponent } from 'react';
import { bs } from '@tesseractcollective/react-graphql';
import { ScalarComponentPropsBase } from '../../types/generic';

export interface ICitextFieldProps extends ScalarComponentPropsBase  {}

const CitextField: FunctionComponent<ICitextFieldProps> = function CitextField(props) {

  return <div className="px-4 py-2 flex-1 justify-start items-stretch">CitextField</div>;
};

export default CitextField;