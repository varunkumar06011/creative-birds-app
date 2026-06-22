import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { SocketProvider } from './context/SocketContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import AutoLoginAdmin from './components/AutoLoginAdmin'
import LandingPage from './pages/LandingPage'
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
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/customer" element={<ProtectedRoute allowedRoles={['customer']}><CustomerHome /></ProtectedRoute>} />
            <Route path="/customer/request" element={<ProtectedRoute allowedRoles={['customer']}><CustomerRequest /></ProtectedRoute>} />
            <Route path="/customer/packages" element={<ProtectedRoute allowedRoles={['customer']}><CustomerPackages /></ProtectedRoute>} />
            <Route path="/customer/tracking" element={<ProtectedRoute allowedRoles={['customer']}><CustomerTracking /></ProtectedRoute>} />
            <Route path="/customer/complaint" element={<ProtectedRoute allowedRoles={['customer']}><CustomerComplaint /></ProtectedRoute>} />
            <Route path="/designer" element={<ProtectedRoute allowedRoles={['designer']}><DesignerHome /></ProtectedRoute>} />
            <Route path="/designer/onboarding" element={<ProtectedRoute allowedRoles={['designer']}><DesignerOnboarding /></ProtectedRoute>} />
            <Route path="/designer/jobs" element={<ProtectedRoute allowedRoles={['designer']}><DesignerJobs /></ProtectedRoute>} />
            <Route path="/designer/earnings" element={<ProtectedRoute allowedRoles={['designer']}><DesignerEarnings /></ProtectedRoute>} />
            <Route path="/admin" element={<AutoLoginAdmin><AdminDashboard /></AutoLoginAdmin>} />
            <Route path="/admin/users" element={<AutoLoginAdmin><AdminUsers /></AutoLoginAdmin>} />
            <Route path="/admin/transactions" element={<AutoLoginAdmin><AdminTransactions /></AutoLoginAdmin>} />
            <Route path="/admin/complaints" element={<AutoLoginAdmin><AdminComplaints /></AutoLoginAdmin>} />
            <Route path="/admin/payouts" element={<AutoLoginAdmin><AdminPayouts /></AutoLoginAdmin>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
