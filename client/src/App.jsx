// import React from 'react'

import { Route, Routes } from 'react-router-dom'
import AuthPage from './pages/AuthPage'
import Dashboard from './pages/Dashboard'
import CreateGroup from './pages/CreateGroup'
import GroupDetailsPage from './pages/GroupDetailsPage'
import AddExpensePage from './pages/AddExpensePage'
import InviteMembersPage from './pages/InviteMembersPage'
import Navbar from './components/Navbar'
const App = () => {
  return (
    <div>
      <Routes>
         <Route path="/" element={<AuthPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-group" element={<CreateGroup/>} />
        <Route path="/groups/:groupId" element={<GroupDetailsPage />} />
        <Route path="/groups/:groupId/add-expense" element={<AddExpensePage />} />
        <Route path="/groups/:groupId/invite" element={<InviteMembersPage />} />
      </Routes>
    </div>
  )
}

export default App