import React from 'react';
import { HasuraConfigType } from '@tesseractcollective/react-graphql';
import { FlexFormComponent } from '../types/generic';

export interface IReactGraphqlUIContext {
  defaultComponents: {
    flexFormComponents: Record<string, FlexFormComponent>;
    SearchInput?: React.ReactElement<{
      value?: string;
      onChange: (e: React.KeyboardEvent) => void;
      placeholder?: string
    }>;
  };
  configsMap: HasuraConfigType;
}

export const ReactGraphqlUIContext = React.createContext<IReactGraphqlUIContext>({
  defaultComponents: {
    flexFormComponents: {},
  },
  configsMap: {},
});
