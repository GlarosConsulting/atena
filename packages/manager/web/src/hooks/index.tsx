import React from 'react';

import { AuthenticationProvider } from './authentication';
import { TasksProvider } from './tasks';

const AppProvider: React.FC = ({ children }) => (
  <AuthenticationProvider>
    <TasksProvider>{children}</TasksProvider>
  </AuthenticationProvider>
);

export default AppProvider;
