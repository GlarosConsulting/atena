import React, { useRef, useEffect, useMemo } from 'react';

import {
  Flex,
  FlexProps,
  Switch as ChakraSwitch,
  SwitchProps as ChakraSwitchProps,
  Text,
  BoxProps,
} from '@chakra-ui/core';
import { useField } from '@unform/core';

interface ISwitchProps extends FlexProps {
  name: string;
  label: string;
  switchProps?: ChakraSwitchProps;
  labelProps?: Omit<BoxProps, 'position'> & { position?: 'left' | 'right' };
}

const Switch: React.FC<ISwitchProps> = ({
  name,
  label,
  switchProps = {},
  labelProps: _labelProps = {},
  ...rest
}) => {
  const switchRef = useRef<HTMLInputElement>(null);

  const { fieldName, defaultValue, error, registerField } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: switchRef.current,
      path: 'checked',
    });
  }, [fieldName, registerField]);

  const labelProps = useMemo(() => {
    const props = _labelProps;

    if (!props.position) {
      props.position = 'right';
    }

    return props;
  }, [_labelProps]);

  const { position, ...restLabelProps } = labelProps;

  return (
    <Flex alignItems="center" {...rest}>
      {position === 'left' && (
        <Text marginRight={3} marginTop="-4px" {...restLabelProps}>
          {label}
        </Text>
      )}

      <ChakraSwitch
        ref={switchRef}
        defaultIsChecked={defaultValue}
        isInvalid={!!error}
        color="blue"
        {...switchProps}
      />

      {position === 'right' && (
        <Text marginLeft={3} marginTop="-4px" {...restLabelProps}>
          {label}
        </Text>
      )}
    </Flex>
  );
};

export default Switch;
