import React from 'react';
import { FiPower } from 'react-icons/fi';

import { Avatar, Box, Flex, Tooltip, useTheme } from '@chakra-ui/core';

import { useAuthentication } from '@/hooks/authentication';

interface ISidebarProps {
  top?: React.ReactNode;
  middle?: React.ReactNode;
}

const Sidebar: React.FC<ISidebarProps> = ({ top, middle }) => {
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
      paddingY={5}
      boxShadow="xl"
    >
      <Flex flexDirection="column" alignItems="center">
        {top}
      </Flex>

      <Flex flexDirection="column" alignItems="center">
        {middle}
      </Flex>

      <Flex flexDirection="column" alignItems="center">
        <Avatar src={user?.avatar_url} size="sm" />

        <Tooltip label="Sair" aria-label="Sair">
          <Box cursor="pointer" onClick={logOut} marginTop={4}>
            <FiPower size={theme.sizes[8]} color={theme.colors.white} />
          </Box>
        </Tooltip>
      </Flex>
    </Flex>
  );
};

export default Sidebar;
