import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { SocketProvider } from './context/SocketContext'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import CustomerHome from './pages/customer/CustomerHome'
import CustomerRequest from './pages/customer/CustomerRequest'
import CustomerPackages from './pages/customer/CustomerPackages'
import CustomerTracking from './pages/customer/CustomerTracking'
import CustomerComplaint from './pages/customer/CustomerComplaint'
import DesignerHome from './pages/designer/DesignerHome'
import DesignerOnboarding from './pages/designer/DesignerOnboarding'
import DesignerJobs from './pages/designer/DesignerJobs'
import DesignerEarnings from './pages/designer/DesignerEarnings'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminTransactions from './pages/admin/AdminTransactions'
import AdminComplaints from './pages/admin/AdminComplaints'
import AdminPayouts from './pages/admin/AdminPayouts'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/customer" element={<CustomerHome />} />
            <Route path="/customer/request" element={<CustomerRequest />} />
            <Route path="/customer/packages" element={<CustomerPackages />} />
            <Route path="/customer/tracking" element={<CustomerTracking />} />
            <Route path="/customer/complaint" element={<CustomerComplaint />} />
            <Route path="/designer" element={<DesignerHome />} />
            <Route path="/designer/onboarding" element={<DesignerOnboarding />} />
            <Route path="/designer/jobs" element={<DesignerJobs />} />
            <Route path="/designer/earnings" element={<DesignerEarnings />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/transactions" element={<AdminTransactions />} />
            <Route path="/admin/complaints" element={<AdminComplaints />} />
            <Route path="/admin/payouts" element={<AdminPayouts />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
