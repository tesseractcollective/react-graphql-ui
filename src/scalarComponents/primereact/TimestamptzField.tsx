import React, { FunctionComponent } from 'react';
import { bs } from '@tesseractcollective/react-graphql';
import { ScalarComponentPropsBase } from '../../types/generic';

export interface ITimestamptzFieldProps  extends ScalarComponentPropsBase {}

const TimestamptzField: FunctionComponent<ITimestamptzFieldProps> = function TimestamptzField(props) {

  return <div className="px-4 py-2 flex-1 justify-start items-stretch">TimestamptzField</div>;
};

export default TimestamptzField;