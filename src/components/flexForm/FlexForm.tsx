import { HasuraDataConfig, UseQueryOneProps, useReactGraphql, UseReactGraphqlApi } from '@tesseractcollective/react-graphql';
import Case from 'case';
import {map} from 'lodash';
import { Button } from 'primereact/button';
import React, { ReactElement, useContext, useEffect, useMemo, useState } from 'react';
import { RegisterOptions, useForm } from 'react-hook-form';
import { CombinedError } from 'urql';
import { ReactGraphqlUIContext } from '../../context/ReactGraphqlUIContext';
import { getDefaultComponentForScalar } from '../../support/getDefaultComponentForScalar';
import { FlexFormFieldOutputType, ScalarComponentPropsBase } from '../../types/generic';
import useFlexForm, { IFlexFormProps } from '../../hooks/flexForm/useFlexForm'

const FlexForm: React.FunctionComponent<IFlexFormProps> = (props: IFlexFormProps) => {
  //Spread primary key onto initial variables for update
  const ffData = useFlexForm(props)
  
  return (
    <form {...ffData.formProps}>
      <div {...ffData.fieldsContainerProps}>
        {...ffData.fieldsElements}
      </div>
      {ffData.gqlError && ffData.errorElement}
      <Button {...ffData.submitButtonProps}></Button>
    </form>
  );
}

export default FlexForm;
