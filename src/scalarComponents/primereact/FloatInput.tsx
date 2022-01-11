import React, { FunctionComponent } from "react";
import { bs } from "@tesseractcollective/react-graphql";
import { ScalarComponentPropsBase } from "../../types/generic";
import NumberInput from "./NumberInput";

export interface IFloatInputProps extends ScalarComponentPropsBase {}

const FloatInput: FunctionComponent<IFloatInputProps> = function FloatInput(
  props
) {
  return (
    <NumberInput
      mode="decimal"
      {...props}
      inputNumberProps={{
        maxFractionDigits: 2,
        minFractionDigits: 2,
        ...props,
      }}
    />
  );
};

export default FloatInput;
