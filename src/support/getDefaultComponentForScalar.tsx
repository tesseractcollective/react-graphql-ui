import { HasuraDataConfig } from '@tesseractcollective/react-graphql';
import Case from 'case';
import { FlexFormComponent } from '../types/generic';

export function getDefaultComponentForScalar(
  config: HasuraDataConfig,
  field: string,
  defaultScalarComponents: Record<string, FlexFormComponent>,
) {
  const fieldMetaLookup = config.fields?.fieldSimpleMap ?? {};
  const fieldInfo = fieldMetaLookup[field];
  const fieldTypePascal = Case.pascal(fieldInfo.typeName);

  const defaultComponent = defaultScalarComponents[fieldTypePascal + 'Input'];
  return { fieldInfo, defaultComponent };
}
