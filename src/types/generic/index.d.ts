import { HasuraDataConfig, IFieldOutputType } from '@tesseractcollective/react-graphql';
import React, { ReactElement, FunctionComponent } from 'react';
import { RegisterOptions } from 'react-hook-form';

export interface FlexFormFieldOutputType extends IFieldOutputType {
  label?: string
}

export interface ScalarComponentPropsBase {
  fieldInfo: FlexFormFieldOutputType
  control: any;
  configs?: {
    [typename: string]: HasuraDataConfig
  }
  rules?: Omit<RegisterOptions, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>
  disabled?: boolean
}

export type FlexFormComponent = FunctionComponent<ScalarComponentPropsBase>