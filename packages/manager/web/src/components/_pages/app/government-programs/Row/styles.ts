import { Box, DefaultTheme, Flex } from '@chakra-ui/core';
import styled from '@emotion/styled';

interface IContainerProps {
  theme: DefaultTheme;
}

export const Container = styled(Flex)<IContainerProps>`
  + div {
    margin-top: ${props => props.theme.sizes[4]};
  }
`;

interface IValueProps {
  width: string;
}

export const Value = styled(Box)<IValueProps>`
  min-width: ${props => props.width};
`;
