import React, { FunctionComponent } from 'react';
import { bs } from '@tesseractcollective/react-graphql';
import { ScalarComponentPropsBase } from '../../types/generic';
import GenericNumberInput from './GenericNumberInput';

export interface IBigintInputProps extends ScalarComponentPropsBase {}

const BigintInput: FunctionComponent<IBigintInputProps> = function BigintInput(props) {
  return <GenericNumberInput mode="decimal" {...props} inputNumberProps={{ ...props } as any} />;
};

export default BigintInput;
