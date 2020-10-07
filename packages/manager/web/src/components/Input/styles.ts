import { Box, DefaultTheme } from '@chakra-ui/core';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { transparentize } from 'polished';

interface IContainerProps {
  theme: DefaultTheme;
  isFocused: boolean;
  isFilled: boolean;
}

export const Container = styled(Box)<IContainerProps>`
  --blue-light: ${props => props.theme.colors.blue[50]};
  --base-color: ${props => props.theme.colors.gray[500]};
  --text-color-focused: ${props => props.theme.colors.blue[800]};

  background: var(--blue-light);
  border-radius: 10px;
  width: 100%;

  color: var(--base-color);
  cursor: text;

  display: flex;
  align-items: center;

  transition: box-shadow 0.2s;

  & + div {
    margin-top: 16px;
  }

  ${props =>
    props.isFocused &&
    css`
      box-shadow: 0 0 0 3px ${transparentize(0.4, props.theme.colors.blue[400])};
      color: var(--text-color-focused);
    `}

  ${props =>
    props.isFilled &&
    css`
      color: var(--text-color-focused);
    `}

  svg {
    margin-right: 16px;
  }

  input {
    flex: 1;
    height: 100%;
    background: transparent;
    border: 0;
    color: var(--text-color-focused);

    &::placeholder {
      color: var(--base-color);
    }
  }
`;
