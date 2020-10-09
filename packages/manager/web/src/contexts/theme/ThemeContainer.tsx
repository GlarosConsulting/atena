import React from 'react';

import {
  ThemeProvider as ChakraThemeProvider,
  ColorModeProvider,
  CSSReset,
} from '@chakra-ui/core';
import { ThemeProvider as EmotionThemeProvider } from 'emotion-theming';

import customTheme from '@/styles/theme';

const ThemeContainer: React.FC = ({ children }) => (
  <ChakraThemeProvider theme={customTheme}>
    <ColorModeProvider value="light">
      <EmotionThemeProvider theme={{}}>
        <CSSReset
          config={(theme, config) => ({
            ...config,
            light: {
              ...config.light,
              bg: theme.colors.gray[100],
              color: theme.colors.gray[700],
            },
          })}
        />
        {children}
      </EmotionThemeProvider>
    </ColorModeProvider>
  </ChakraThemeProvider>
);

export default ThemeContainer;
