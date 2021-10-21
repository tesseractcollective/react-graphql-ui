import { HasuraDataConfig } from '@tesseractcollective/react-graphql'
import _ from 'lodash'

import React, { FunctionComponent, useContext, useEffect, useMemo } from 'react'
import SelectViaRelationship from '../../components/SelectViaRelationship';
import { ReactGraphqlUIContext } from '../../context/ReactGraphqlUIContext';
import { FlexFormFieldOutputType, ScalarComponentPropsBase } from '../../types/generic';

interface IRelationshipFieldOutputType extends FlexFormFieldOutputType {
  relationship: { table: string; field: string }
}

export interface IRelationshipInputProps extends ScalarComponentPropsBase {
  fieldInfo: IRelationshipFieldOutputType
}

const RelationshipInput: FunctionComponent<IRelationshipInputProps> =
  function RelationshipInput({
    fieldInfo,
    control,
    configs,
    ...passthroughProps
  }) {
    const rgUIContext = useContext(ReactGraphqlUIContext);
    const HasuraConfig = rgUIContext.configsMap;

    const relationshipConfig: HasuraDataConfig | undefined =
      configs?.[fieldInfo.relationship.table] ||
      HasuraConfig[fieldInfo.relationship.table + 'Select'] ||
      HasuraConfig[fieldInfo.relationship.table] ||
      _.find(HasuraConfig, (val, key) => val.typename === fieldInfo.typeName)

    useEffect(() => {
      if (!relationshipConfig) {
        console.error(`Additional configs required on Flex form when relationships are detected. 
      Missing config for: ${fieldInfo.relationship.table}.
      Add:  <FlexForm configs={{${fieldInfo.relationship.table}: hasuraConfig.CONFIG}}`)
      }
    }, [])

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
      )
    }, [])

    if (!relationshipConfig) {
      return null
    }

    return (
      <SelectViaRelationship
        configForRelationship={relationshipConfig}
        control={control}
        name={fieldInfo.name}
        relationshipColumnNameForLabel={
          labelColumn || relationshipConfig.primaryKey[0]
        }
        relationshipColumnNameForValue={relationshipConfig.primaryKey[0]}
        where={relationshipConfig?.relationshipMeta?.defaultWhere}
        dropdownProps={passthroughProps as any}
      />
    )
  }

export default RelationshipInput
