import * as React from 'react';

import { Flex } from '@chakra-ui/core';
import { FlexProps } from '@chakra-ui/core/dist/Flex';

type ICardHeaderProps = FlexProps;

const CardHeader: React.FC<ICardHeaderProps> = ({ children, ...rest }) => (
  <Flex
    borderBottomWidth="1px"
    padding={4}
    roundedTopLeft={4}
    roundedTopRight={4}
    flexDirection="column"
    {...rest}
  >
    {children}
  </Flex>
);

export default CardHeader;
