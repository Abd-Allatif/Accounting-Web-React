import './App.css'
import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom';
import { Suspense } from 'react';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute } from './components';
import Loading from './pages/LoadingScreen/Loading'

const Login = React.lazy(() => import('./pages/auth/Login'))
const Register = React.lazy(() => import('./pages/auth/Register'))
const Resetpass = React.lazy(() => import('./pages/auth/ResetPassword'))
const SetAccount = React.lazy(() => import('./pages/auth/SetupAccount'))
const MainSellScreen = React.lazy(() => import('./pages/dashboard/Dashboard'))
const Customers = React.lazy(() => import('./pages/customers/Customers'))
const SellCustomer = React.lazy(() => import('./pages/customer-sells/CustomerSells'))
const MoneyIncome = React.lazy(() => import('./pages/income/Income'))
const Payments = React.lazy(() => import('./pages/payments/Payments'))
const Types = React.lazy(() => import('./pages/types/Types'))
const Supplies = React.lazy(() => import('./pages/supplies/Supplies'))
const Reciepts = React.lazy(() => import('./pages/receipts/Receipts'))
const Employee = React.lazy(() => import('./pages/employees/Employees'))
const MathNotes = React.lazy(() => import('./pages/ai/MathNotes'))
const NotFound = React.lazy(() => import('./pages/Notfound/Notfound'))
const DispatchSupplies = React.lazy(() => import('./pages/dispatches/Dispatches'))
const Inventory = React.lazy(() => import('./pages/inventory/Inventory'))
const Options = React.lazy(() => import('./pages/options/Options'))

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-pass" element={<Resetpass />} />
            <Route path="/setup-account" element={<PrivateRoute element={SetAccount} />} />
            <Route path="/main" element={<Navigate to="/main/dashboard" replace />} />
            <Route path="/main/dashboard" element={<PrivateRoute element={MainSellScreen} />} />
            <Route path="/main/customers" element={<PrivateRoute element={Customers} />} />
            <Route path="/main/sell-customers" element={<PrivateRoute element={SellCustomer} />} />
            <Route path="/main/money-income" element={<PrivateRoute element={MoneyIncome} />} />
            <Route path="/main/income" element={<PrivateRoute element={MoneyIncome} />} />
            <Route path="/main/payments" element={<PrivateRoute element={Payments} />} />
            <Route path="/main/types" element={<PrivateRoute element={Types} />} />
            <Route path="/main/supplies" element={<PrivateRoute element={Supplies} />} />
            <Route path="/main/dispatch-supplies" element={<PrivateRoute element={DispatchSupplies} />} />
            <Route path="/main/dispatches" element={<PrivateRoute element={DispatchSupplies} />} />
            <Route path="/main/reciepts" element={<PrivateRoute element={Reciepts} />} />
            <Route path="/main/receipts" element={<PrivateRoute element={Reciepts} />} />
            <Route path="/main/employees" element={<PrivateRoute element={Employee} />} />
            <Route path="/main/sells" element={<PrivateRoute element={SellCustomer} />} />
            <Route path="/main/customer-sells" element={<PrivateRoute element={SellCustomer} />} />
            <Route path="/main/inventory" element={<PrivateRoute element={Inventory} />} />
            <Route path="/math-notes" element={<PrivateRoute element={MathNotes} />} />
            <Route path="/main/options" element={<PrivateRoute element={Options} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
      </Suspense>
    </AuthProvider>
  )
}

export default App
