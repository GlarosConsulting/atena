import { Box, DefaultTheme } from '@chakra-ui/core';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { transparentize } from 'polished';

interface IContainerProps {
  theme: DefaultTheme;
  isFocused: boolean;
  isFilled: boolean;
  isErrored: boolean;
}

export const Container = styled(Box)<IContainerProps>`
  --base-color: ${props => props.theme.colors.gray[500]};
  --text-color-focused: ${props => props.theme.colors.blue[800]};
  --focused-box-shadow: 0 0 0 3px
    ${props => transparentize(0.4, props.theme.colors.blue[400])};
  --errored-box-shadow: 0 0 0 3px
    ${props => transparentize(0.4, props.theme.colors.red[500])};

  color: var(--base-color);
  cursor: text;

  display: flex;
  align-items: center;

  transition: box-shadow 0.2s;

  ${props =>
    props.isErrored &&
    css`
      box-shadow: var(--errored-box-shadow);
    `}

  ${props =>
    props.isFocused &&
    css`
      box-shadow: var(--focused-box-shadow);
      color: var(--text-color-focused) !important;
    `}

  ${props =>
    props.isFilled &&
    css`
      color: var(--text-color-focused) !important;
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
