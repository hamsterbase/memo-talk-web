import { NavBar } from 'antd-mobile';
import React from 'react';

export const App: React.FC = () => {
  return (
    <div>
      <NavBar onBack={() => window.history.back()}>设置</NavBar>
    </div>
  );
};
