import React, { useState } from 'react';
import { Login } from './components/Login';
import { UserInfoForm } from './components/UserInfoForm';
import { Dashboard } from './components/Dashboard';
import { ViewState } from './types';

function App() {
  const [viewState, setViewState] = useState<ViewState>(ViewState.LOGIN);
  const [userName, setUserName] = useState<string>('');

  const handleLogin = () => {
    setViewState(ViewState.USER_INFO);
  };

  const handleUserInfoSubmit = (name: string) => {
    setUserName(name);
    setViewState(ViewState.DASHBOARD);
  };

  const handleLogout = () => {
    setUserName('');
    setViewState(ViewState.LOGIN);
  };

  const renderView = () => {
    switch(viewState) {
      case ViewState.LOGIN:
        return <Login onLogin={handleLogin} />;
      case ViewState.USER_INFO:
        return <UserInfoForm onSubmit={handleUserInfoSubmit} />;
      case ViewState.DASHBOARD:
        return <Dashboard userName={userName} onLogout={handleLogout} />;
      default:
        return <Login onLogin={handleLogin} />;
    }
  };

  return (
    <div className="antialiased text-slate-100 selection:bg-purple-500 selection:text-white">
      {renderView()}
    </div>
  );
}

export default App;