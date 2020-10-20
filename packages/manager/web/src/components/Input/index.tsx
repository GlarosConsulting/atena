import React, { useRef, useState, useCallback, useEffect } from 'react';
import { IconBaseProps } from 'react-icons';

import {
  Input as ChakraInput,
  InputProps as ChakraInputProps,
  PseudoBoxProps as ChakraPseudoBoxProps,
} from '@chakra-ui/core';
import { useField } from '@unform/core';

import { Container } from './styles';

interface IInputProps extends ChakraInputProps {
  name: string;
  icon?: React.ComponentType<IconBaseProps>;
  containerProps?: ChakraPseudoBoxProps;
}

const Input: React.FC<IInputProps> = ({
  name,
  containerProps = {},
  icon: Icon,
  ...rest
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const { fieldName, defaultValue, error, registerField } = useField(name);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);

    setIsFilled(!!inputRef.current?.value);
  }, []);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
    });
  }, [fieldName, registerField]);

  return (
    <Container
      isFocused={isFocused}
      isFilled={isFilled}
      isErrored={!!error}
      bg="blue.50"
      width="100%"
      height={12}
      borderRadius="md"
      paddingLeft={4}
      {...containerProps}
      onClick={() => {
        inputRef.current.focus();
      }}
    >
      {Icon && <Icon size={15} />}

      <ChakraInput
        ref={inputRef}
        defaultValue={defaultValue}
        focusBorderColor={null}
        paddingLeft={0}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        {...rest}
      />
    </Container>
  );
};

export default Input;
