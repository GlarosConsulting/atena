import React from 'react';
import { FiPower } from 'react-icons/fi';

import { Avatar, Box, Flex, useTheme } from '@chakra-ui/core';

import { useAuthentication } from '@/hooks/authentication';

const Sidebar: React.FC = ({ children }) => {
  const theme = useTheme();

  const { user, logOut } = useAuthentication();

  return (
    <Flex
      as="nav"
      position="fixed"
      top={0}
      left={0}
      bg="blue.500"
      height="100vh"
      width={16}
      flexDirection="column"
      justifyContent="space-between"
      alignItems="center"
      paddingY={6}
      boxShadow="xl"
    >
      <div />

      <Flex flexDirection="column" alignItems="center">
        {children}
      </Flex>

      <Flex flexDirection="column" alignItems="center">
        <Avatar src={user?.avatar_url} size="sm" />

        <Box cursor="pointer" onClick={logOut} marginTop={4}>
          <FiPower size={theme.sizes[8]} color={theme.colors.white} />
        </Box>
      </Flex>
    </Flex>
  );
};

export default Sidebar;
