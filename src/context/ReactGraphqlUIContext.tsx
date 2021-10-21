import { HasuraConfigType } from '@tesseractcollective/react-graphql';
import React from 'react';
import { FlexFormComponent } from '../types/generic';

export const ReactGraphqlUIContext = React.createContext<{
  defaultComponents: Record<string, FlexFormComponent>;
  configsMap: HasuraConfigType;
}>({
  defaultComponents: {},
  configsMap: {},
});
