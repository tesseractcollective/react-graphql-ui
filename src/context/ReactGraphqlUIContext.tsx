import React from 'react';
import { HasuraConfigType } from '@tesseractcollective/react-graphql';
import { FlexFormComponent } from '../types/generic';

export const ReactGraphqlUIContext = React.createContext<{
  defaultComponents: Record<string, FlexFormComponent>;
  configsMap: HasuraConfigType;
}>({
  defaultComponents: {},
  configsMap: {},
});
