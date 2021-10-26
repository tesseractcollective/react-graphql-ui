import React from 'react';
import { HasuraConfigType } from '@tesseractcollective/react-graphql';
import { FlexFormComponent } from '../types/generic';

//@ts-ignore
console.log('ReactGraphqlUIContext: Are react versions the same', window.React1 === React);

export const ReactGraphqlUIContext = React.createContext<{
  // defaultComponents: Record<string, FlexFormComponent>;
  // configsMap: HasuraConfigType;
}>({
  // defaultComponents: {},
  // configsMap: {},
});
