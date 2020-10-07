import { AppProps } from 'next/app';
import React from 'react';

import ThemeContainer from '@/contexts/theme/ThemeContainer';

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => (
  <>
    <ThemeContainer>
      <Component {...pageProps} />
    </ThemeContainer>
  </>
);

export default MyApp;
