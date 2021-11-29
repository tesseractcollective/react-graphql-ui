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
  if (!fieldInfo) {
    throw new Error(`🔍Cannot find fieldInfo for field named "${field}" in the Hasura Config provided for "${
      config?.typename
    }"
    + Did you make a typo or use the incorrect name for the field?
    + Confirm you included the field in your fragment

    🐛 Field names found in config (alphabetical):
    [${Object.keys(config?.fields?.fieldSimpleMap ?? {})
      .sort()
      .join(', ')}]`)
  }
  const fieldTypePascal = Case.pascal(fieldInfo.typeName);

  const defaultComponent = defaultScalarComponents[fieldTypePascal + 'Input'];
  return { fieldInfo, defaultComponent };
}