import { Route, Routes } from 'react-router-dom';

import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import CreateGroup from './pages/CreateGroup';
import GroupExpenses from './pages/GroupExpenses';
import InviteAcceptPage from './pages/InviteAcceptPage';
import ProfilePage from './pages/ProfilePage';
// import ProtectedRoute from './components/ProtectRoute';

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<AuthPage />} />
      <Route path="/invite/:groupId" element={<InviteAcceptPage />} />

      {/* Protected Routes - Uncomment if ProtectedRoute is implemented */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/create-group" element={<CreateGroup />} />
      <Route path="/groups/:groupId" element={<GroupExpenses />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  );
};

export default App;
