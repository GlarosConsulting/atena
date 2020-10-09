import * as React from 'react';

import { Flex } from '@chakra-ui/core';
import { FlexProps } from '@chakra-ui/core/dist/Flex';

type ICardFooterProps = FlexProps;

const CardFooter: React.FC<ICardFooterProps> = ({ children, ...rest }) => (
  <Flex
    borderTopWidth="1px"
    overflowX="hidden"
    overflowY="hidden"
    padding={4}
    bg="white"
    roundedBottomLeft={4}
    roundedTopRight={4}
    flexDirection="column"
    {...rest}
  >
    {children}
  </Flex>
);

export default CardFooter;
