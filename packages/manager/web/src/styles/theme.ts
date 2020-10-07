import { theme, DefaultTheme } from '@chakra-ui/core';

const customTheme: DefaultTheme = {
  ...theme,
  fonts: {
    body: 'Roboto, system-ui, sans-serig',
    heading: 'Roboto, system-ui, sans-serig',
    mono: 'Menlo, monospace',
  },
  fontWeights: {
    ...theme.fontWeights,
    normal: 400,
    medium: 500,
    bold: 700,
  },
  radii: {
    ...theme.radii,
    sm: '5px',
    md: '8px',
  },
  fontSizes: {
    ...theme.fontSizes,
  },
};

export default customTheme;
