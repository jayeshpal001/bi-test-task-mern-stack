import { Route, Routes } from 'react-router-dom';

import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import CreateGroup from './pages/CreateGroup';
import GroupDetailsPage from './pages/GroupDetailsPage';
import AddExpensePage from './pages/AddExpensePage';
import InviteMembersPage from './pages/InviteMembersPage';
import PrivateRoute from './components/PrivateRoutes';

const App = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/" element={<AuthPage />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/create-group"
        element={
          <PrivateRoute>
            <CreateGroup />
          </PrivateRoute>
        }
      />
      <Route
        path="/groups/:groupId"
        element={
          <PrivateRoute>
            <GroupDetailsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/groups/:groupId/add-expense"
        element={
          <PrivateRoute>
            <AddExpensePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/groups/:groupId/invite"
        element={
          <PrivateRoute>
            <InviteMembersPage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default App;
