import { HasuraDataConfig, IFieldOutputType } from '@tesseractcollective/react-graphql';
import { ReactElement } from 'react';
import { RegisterOptions } from 'react-hook-form';

interface FlexFormFieldOutputType extends IFieldOutputType {
  label?: string
}

interface ScalarComponentPropsBase {
  fieldInfo: FlexFormFieldOutputType
  control: any;
  configs?: {
    [typename: string]: HasuraDataConfig
  }
  rules?: Omit<RegisterOptions, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>
}

type FlexFormComponent = (props: ScalarComponentPropsBase) => ReactElement;