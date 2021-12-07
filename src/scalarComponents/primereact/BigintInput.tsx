import React, { FunctionComponent } from 'react';
import { bs } from '@tesseractcollective/react-graphql';
import { ScalarComponentPropsBase } from '../../types/generic';
import NumberInput from './NumberInput';

export interface IBigintInputProps extends ScalarComponentPropsBase {}

const BigintInput: FunctionComponent<IBigintInputProps> = function BigintInput(props) {
  return <NumberInput {...props} inputNumberProps={{ ...props } as any} />;
};

export default BigintInput;
