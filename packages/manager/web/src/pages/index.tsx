import React from 'react';

import Private from '@/components/Private';
import SEO from '@/components/SEO';

const Home: React.FC = () => (
  <>
    <SEO title="Atena Gestor" image="boost.png" shouldExcludeTitleSuffix />
    <Private />
  </>
);

export default Home;
