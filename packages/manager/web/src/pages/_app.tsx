import { AppProps } from 'next/app';
import React from 'react';

import 'react-datepicker/dist/react-datepicker.css';
import '@/components/DatePicker/module.css';

import ThemeContainer from '@/contexts/theme/ThemeContainer';
import AppProvider from '@/hooks';

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => (
  <ThemeContainer>
    <AppProvider>
      <Component {...pageProps} />
    </AppProvider>
  </ThemeContainer>
);

export default MyApp;
