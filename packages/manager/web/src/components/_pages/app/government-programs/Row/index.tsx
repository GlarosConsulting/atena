import React from 'react';

import { Container } from './styles';

const Row: React.FC = ({ children }) => (
  <Container
    border="1px solid"
    borderColor="gray.300"
    borderRadius="md"
    paddingY={2}
    paddingX={3}
    fontSize="lg"
  >
    {children}
  </Container>
);

export default Row;

export { Value } from './styles';
