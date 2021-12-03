import { HasuraDataConfig } from '@tesseractcollective/react-graphql';
import {find} from 'lodash';

import React, { FunctionComponent, useContext, useEffect, useMemo } from 'react';
import SelectViaRelationship from '../../components/SelectViaRelationship';
import { ReactGraphqlUIContext } from '../../context/ReactGraphqlUIContext';
import { FlexFormFieldOutputType, ScalarComponentPropsBase } from '../../types/generic';

interface IRelationshipFieldOutputType extends FlexFormFieldOutputType {
  relationship: { table: string; field: string };
}

const RelationshipInput: FunctionComponent<ScalarComponentPropsBase> = function RelationshipInput({
  fieldInfo: _fieldInfo,
  control,
  configs,
  ...passthroughProps
}) {
  const rgUIContext = useContext(ReactGraphqlUIContext);
  const HasuraConfig = rgUIContext.configsMap;
  const fieldInfo = { ...(_fieldInfo as IRelationshipFieldOutputType) };

  const relationshipConfig: HasuraDataConfig | undefined =
    configs?.[fieldInfo.relationship.table + 'Select'] ||
    configs?.[fieldInfo.relationship.table] ||
    HasuraConfig[fieldInfo.relationship.table + 'Select'] ||
    HasuraConfig[fieldInfo.relationship.table] ||
    find(HasuraConfig, (val, key) => val.typename === fieldInfo.typeName);

  useEffect(() => {
    if (!relationshipConfig) {
      console.error(`Additional configs required on Flex form when relationships are detected. 
      Missing config for: ${fieldInfo.relationship.table}.
      Add:  <FlexForm configs={{${fieldInfo.relationship.table}: hasuraConfig.CONFIG}}`);
    }
  }, []);

  const labelColumn = useMemo(() => {
    return (
      relationshipConfig?.relationshipMeta?.labelField ||
      relationshipConfig?.fields?.fieldSimpleMap?.['description']?.name ||
      relationshipConfig?.fields?.fieldSimpleMap?.['desc']?.name ||
      relationshipConfig?.fields?.fieldSimpleMap?.['displayName']?.name ||
      relationshipConfig?.fields?.fieldSimpleMap?.['name']?.name ||
      relationshipConfig?.fields?.fieldSimpleMap?.['type']?.name ||
      relationshipConfig?.fields?.fieldSimpleMap?.['status']?.name ||
      null
    );
  }, []);

  if (fieldInfo.enumValues && !relationshipConfig) {
    return (
      <SelectViaRelationship
        configForRelationship={{
          typename: fieldInfo.relationship.table,
          primaryKey: [fieldInfo.relationship.field],
          fieldFragment: {
            kind: 'Document',
            definitions: [],
          },
        }}
        fieldInfo={fieldInfo}
        control={control}
        name={fieldInfo.name}
        relationshipColumnNameForLabel={labelColumn || fieldInfo.relationship.field}
        relationshipColumnNameForValue={fieldInfo.relationship.field}
        dropdownProps={passthroughProps as any}
      />
    );
  }

  if (!relationshipConfig && !fieldInfo.enumValues) {
    return null;
  }

  return (
    <SelectViaRelationship
      configForRelationship={relationshipConfig}
      control={control}
      name={fieldInfo.name}
      fieldInfo={fieldInfo}
      relationshipColumnNameForLabel={labelColumn || relationshipConfig.primaryKey[0]}
      relationshipColumnNameForValue={relationshipConfig.primaryKey[0]}
      where={relationshipConfig?.relationshipMeta?.defaultWhere}
      dropdownProps={passthroughProps as any}
    />
  );
};

export default RelationshipInput;
