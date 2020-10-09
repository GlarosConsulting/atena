import React from 'react';
import { useSpring, animated } from 'react-spring';

import { Flex } from '@chakra-ui/core';
import { BoxProps } from '@chakra-ui/core/dist/Box';

interface ICardProps extends BoxProps {
  onClick?: (event: React.MouseEvent<any, MouseEvent>) => void;
  color?: string;
}

const AnimatedFlex = animated(Flex);

const Card: React.FC<ICardProps> = ({
  children,
  onClick = () => false,
  ...rest
}) => {
  const fade = useSpring({
    to: {
      opacity: 1,
      transform: 'translate3d(0, 0px, 0)',
    },
    from: {
      opacity: 0,
      transform: 'translate3d(0, 30px, 0)',
    },
  });

  return (
    <AnimatedFlex
      bg="white"
      width="auto"
      rounded="md"
      borderWidth="1px"
      flexDirection="column"
      style={fade}
      onClick={onClick}
      {...rest}
    >
      {children}
    </AnimatedFlex>
  );
};

export default Card;
