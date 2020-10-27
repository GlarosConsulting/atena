import { Box, DefaultTheme, Flex, Text } from '@chakra-ui/core';
import { css } from '@emotion/core';
import styled from '@emotion/styled';

interface IContainerProps {
  theme: DefaultTheme;
  isOpen: boolean;
}

export const Container = styled(Box)<IContainerProps>`
  cursor: pointer;

  ${props =>
    props.isOpen &&
    css`
      background: ${props.theme.colors.gray[200]};
    `}

  :hover {
    background: ${props => props.theme.colors.gray[200]};
  }

  + div {
    margin-top: ${props => props.theme.space[4]};
  }
`;

interface IValueProps {
  theme: DefaultTheme;
  width: string;
}

export const Value = styled(Text)<IValueProps>`
  width: 100%;

  @media (min-width: ${props => props.theme.breakpoints['md']}) {
    width: ${props => props.width};
    min-width: ${props => props.width};
  }
`;

Value.defaultProps = {
  as: 'span',
};

export const AmendmentRow = styled(Flex)`
  :last-child {
    margin-bottom: 0;
  }
`;
