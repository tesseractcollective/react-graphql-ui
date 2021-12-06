import { HasuraDataConfig, UseQueryOneProps, useReactGraphql, UseReactGraphqlApi } from '@tesseractcollective/react-graphql';
import Case from 'case';
import _ from 'lodash';
import { Button } from 'primereact/button';
import React, { ReactElement, useContext, useEffect, useMemo, useState } from 'react';
import { RegisterOptions, useForm } from 'react-hook-form';
import { CombinedError } from 'urql';
import { ReactGraphqlUIContext } from '../../context/ReactGraphqlUIContext';
import { getDefaultComponentForScalar } from '../../support/getDefaultComponentForScalar';
import { FlexFormFieldOutputType, ScalarComponentPropsBase } from '../../types/generic';

export interface IFlexFormProps {
  config: HasuraDataConfig;
  //If you want to connect this form to a paginatedTable you can pass in the api for the table and we'll use that.
  api?: UseReactGraphqlApi;
  //If you have existing data for your fields like a "row" give it here, else empty object
  data?: any;
  /**
   * Useful when you want a field defaulted without allowing modification.
   * Any fields listed here will not be display, but will still exist for the purposes of submitting.
   */
  hideFields?: [string];
  //If you want to override what is in the config.fragment you can give a list of fieldNames here.
  //Currenty only fields found in the fragment will work, so this filters down
  //Note: id ignored by default because you can't insert or update an id
  fields?: string[];
  //If your data has any foreign keys or relationships, you'll need to supply the configs for those here.
  //IE - if you have an `amountType` that points to `amountTypes.type`. You'll need to pass in: {amountTypes: HasuraConfig.amountSelect} so that we can find the right relationship columns you want to use.
  //If you want to override which column is used for the value or the label Spread your config onto a new object and add in `relationshipMeta: {...}` to override the field
  //If you need to add a where clause to filter the options you can do so on relationshipMeta.defaultWhere
  configs?: {
    [typename: string]: HasuraDataConfig;
  };
  //If you need to tweak or control the default insert config
  insertConfig?: UseReactGraphqlApi['useInsert'];
  //If you need to tweak or control the default update config
  updateConfig?: UseReactGraphqlApi['useUpdate'];
  // Coming soon: children?: ReactElement | Array<ReactElement>
  isNew?: boolean | ((data: any) => boolean);
  // We'll submit for you, but if you need to know when they click the button...
  onSubmit?: (data: any) => void;
  onSuccess?: (data: any) => void;
  //Override any components used.  Key=fieldName Value=component.  IE - displayName: ()=> <MyOverride/>.
  //Recieved ScalarComponentPropsBase as props
  components?: Record<string, (props: ScalarComponentPropsBase) => ReactElement>;
  //Add additional grid styles.  Component styling to be done in the individual components
  grid?: {
    styles?: string;
    columnCount?: number;
  };
  //Additional props that will be passed through to the field component
  props?: Record<
    string,
    {
      [key: string]: any;
      rules?: Omit<RegisterOptions, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
    }
  >;
  onDataChange?: (data: any) => void;
  labels?: Record<string, string>;
  disableAllFields?: boolean;
  existingRecordQueryArgs?: UseQueryOneProps;
}

const FlexForm: React.FunctionComponent<IFlexFormProps> = (props: IFlexFormProps) => {
  //Spread primary key onto initial variables for update
  const {
    config,
    fields: _fields,
    api: externalApi,
    configs,
    data: passedInData,
    insertConfig,
    updateConfig,
    onDataChange,
    disableAllFields,
    props: passthroughProps,
    existingRecordQueryArgs: _existingRecordQueryArgs,
  } = props;
  const [gqlError, setGqlError] = useState<string | null>(null);

  const isNew = props.isNew ? (typeof props.isNew === 'function' ? props.isNew(props.data) : props.isNew) : false;

  const [queryVariables] = useState(() => _existingRecordQueryArgs);

  const existingRecordQueryState = queryVariables ? useReactGraphql(config).useQueryOne({
    ...queryVariables,
    variables: {
      ...queryVariables?.variables,
    }    
  }) : null

  const data = useMemo(() => {
    // Grab a deep copy of _data. We want that to compare to the original if needed.
    let data = passedInData || existingRecordQueryState?.item;
    if (!passedInData || Array.isArray(data)) {
      return data;
    } else if (passedInData) {
      data = { ...passedInData };
    } else if (existingRecordQueryState?.item) {
      data = { ...existingRecordQueryState?.item };
    }

    // PreProcess with some defaults. For instance if there's a timestamp field
    // the default preprocessing is to convert it into a Date object.
    // If that is undesirable a user can map the passedInData before sending it in
    for (const [datumName, datumValue] of Object.entries(data)) {
      const datumTypeName = config.fields?.fieldSimpleMap?.[datumName]?.typeName;

      // Convert timestamps to Date objects
      if (typeof datumValue === 'string' && (datumTypeName === 'timestamp' || datumTypeName === 'timestamptz')) {
        data[datumName] = new Date(datumValue);
      }
    }

    return data;
  }, [passedInData, existingRecordQueryState]);

  useEffect(() => {
    if (onDataChange) {
      onDataChange(data);
    }
  }, [data]);

  let fields: string[] = useMemo(() => {
    if (_fields?.length) {
      return _fields;
    }
    const autoFields = _.map(config.fields?.fieldSimpleMap ?? {}, (field) => field?.name ?? '');
    if (autoFields) return autoFields;
    return [];
  }, [_fields, config]);

  const api = externalApi ?? useReactGraphql(config);

  const useInsertConfig = useMemo(
    () =>
      insertConfig
        ? {
            ...(insertConfig as any),
            resultHelperOptions: {
              onSuccess: (data: any) => props.onSuccess?.(data),
              onError: (err: CombinedError) => setGqlError(err.message),
            },
          }
        : {
            resultHelperOptions: {
              onSuccess: (data: any) => props.onSuccess?.(data),
              onError: (err: CombinedError) => setGqlError(err.message),
            },
          },
    [insertConfig, setGqlError, props.onSuccess],
  );

  const insertMutation = api.useInsert(useInsertConfig);
  const useUpdateConfig = useMemo(
    () =>
      updateConfig
        ? {
            ...(updateConfig as any),
            resultHelperOptions: {
              onSuccess: (data: any) => props.onSuccess?.(data),
              onError: (err: CombinedError) => setGqlError(err.message),
            },
          }
        : {
            initialVariables: config.primaryKey.reduce(
              (obj: any, key: string) => ({
                ...obj,
                [key]: props?.data?.[key] || 'abc',
              }),
              {},
            ),
            resultHelperOptions: {
              onSuccess: (data: any) => props.onSuccess?.(data),
              onError: (err: CombinedError) => setGqlError(err.message),
            },
          },
    [updateConfig, setGqlError, props.onSuccess],
  );

  const updateMutation = api.useUpdate(useUpdateConfig);
  const mutationState = isNew ? insertMutation : updateMutation;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: data,
  });

  const onSubmit = (data: any) => {
    let strippedData = data;

    // If this is a preexisting item (ie an update/edit) we likely don't want to send the entire object
    // which will include things such as the created_at timestamp that we cannot modify those columns
    if (!isNew) {
      // rip out only the keys that are in the fields
      strippedData = Object.keys(data)
        .filter((key) => fields.includes(key))
        .reduce((obj: any, key: string) => {
          obj[key] = data[key];
          return obj;
        }, {});
    }

    mutationState.executeMutation(strippedData);
  };

  const rgUIContext = useContext(ReactGraphqlUIContext);

  const fieldsElements = useMemo(() => {
    const RelationshipInput = props.components?.RelationshipInput || rgUIContext.defaultComponents.flexFormComponents['RelationshipInput'];
    return fields
      .filter((fieldName: string) => {
        if (fieldName === 'id') {
          // Never allow id
          return false;
        }
        // nothing to hide? keep it all!
        if (!props?.hideFields?.length) {
          return true;
        }
        // otherwise don't show stuff in this list
        return !props.hideFields.includes(fieldName);
      })
      .map((field) => {
        const { fieldInfo, defaultComponent } = getDefaultComponentForScalar(config, field, rgUIContext.defaultComponents.flexFormComponents);
        const fieldTypePascal = Case.pascal(fieldInfo.typeName);

        const Component = props.components?.[fieldInfo.name] || (fieldInfo.relationship && RelationshipInput) || defaultComponent;

        if (!Component) {
          // @ts-ignore
          if (fieldInfo.typeName?.ofType?.name) {
            console.warn(`FlexForm does not currently support nested relationships in fragments automatically.
            To handle this manually either:
            * Pass it in on props.components ={ ${fieldInfo.typeName}: <MyComponent />}
            or
            * Export a component called ${fieldTypePascal}Input in defaultScalarComponents/index.tsx`);
          } else {
            console.warn(`Missing component for field: ${fieldInfo.name} and type ${fieldInfo.typeName}. 
            * Pass it in on props.components ={ ${fieldInfo.typeName}: <MyComponent />}
            * Export a component called ${fieldTypePascal}Input in defaultScalarComponents/index.tsx`);
          }
        }

        const { rules, ...propsToPass } = passthroughProps?.[fieldInfo.name] ?? {};

        const newFieldInfo: FlexFormFieldOutputType = { ...fieldInfo };
        if (props.labels?.[fieldInfo.name]) {
          newFieldInfo.label = props.labels?.[fieldInfo.name];
        }

        return (
          <Component
            key={'FF-' + field}
            fieldInfo={newFieldInfo}
            control={control}
            configs={configs}
            rules={{ required: fieldInfo.isNonNull, ...rules }}
            disabled={disableAllFields}
            {...propsToPass}
          />
        );
      });
  }, [config, fields, configs]);

  return (
    <form onSubmit={handleSubmit(props.onSubmit ?? onSubmit)} className={`flex flex-col p-8`}>
      <div className={props.grid?.styles || `grid grid-cols-${props.grid?.columnCount ?? '3'} gap-x-12 gap-y-8 justify-items-stretch mb-5`}>
        {...fieldsElements}
      </div>
      {gqlError && <small className="p-error p-d-block">{gqlError}</small>}
      <Button className="border self-end" type="submit" loading={mutationState.mutationState.fetching} label="Submit"></Button>
    </form>
  );
}

export default FlexForm;
