import './App.css'
import React from 'react'
const Login = React.lazy(() => import('./pages/User/Login'))
const Register = React.lazy(() => import('./pages/User/Register'))
const Resetpass = React.lazy(() => import('./pages/User/Resertpass'))
const SetAccount = React.lazy(() => import('./pages/Accountsetup/Setaccount'))
const MainSellScreen = React.lazy(() => import('./pages/MainScreen/Mainscreen'))
const Customers = React.lazy(() => import('./pages/MainScreen/Customers'))
const SellCustomer = React.lazy(() => import('./pages/MainScreen/Sellcustomer'))
const MoneyIncome = React.lazy(() => import('./pages/MainScreen/Moneyincome'))
const Payments = React.lazy(() => import('./pages/MainScreen/Payments'))
const Types = React.lazy(() => import('./pages/MainScreen/Types'))
const Supplies = React.lazy(() => import('./pages/MainScreen/Supplies'))
const Reciepts = React.lazy(() => import('./pages/MainScreen/Reciepts'))
const Employee = React.lazy(() => import('./pages/MainScreen/Employee'))
const MathNotes = React.lazy(() => import('./pages/ai/MathNotes'))
const NotFound = React.lazy(() => import('./pages/Notfound/Notfound'))
import Loading from './pages/LoadingScreen/Loading'
const DispatchSupplies = React.lazy(() => import('./pages/MainScreen/Dispatchsupplies'))
const Inventory = React.lazy(() => import('./pages/MainScreen/Inventory'))
const Options = React.lazy(() => import('./pages/MainScreen/Options'))
import { Route, Routes} from 'react-router-dom';
import { Suspense } from 'react';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute } from './components';

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-pass" element={<Resetpass />} />
            <Route path="/setup-account" element={<PrivateRoute element={SetAccount} />} />
            <Route path="/main" element={<PrivateRoute element={MainSellScreen} />} />
            <Route path="/main/customers" element={<PrivateRoute element={Customers} />} />
            <Route path="/main/sell-customers" element={<PrivateRoute element={SellCustomer} />} />
            <Route path="/main/money-income" element={<PrivateRoute element={MoneyIncome} />} />
            <Route path="/main/payments" element={<PrivateRoute element={Payments} />} />
            <Route path="/main/types" element={<PrivateRoute element={Types} />} />
            <Route path="/main/supplies" element={<PrivateRoute element={Supplies} />} />
            <Route path="/main/dispatch-supplies" element={<PrivateRoute element={DispatchSupplies} />} />
            <Route path="/main/reciepts" element={<PrivateRoute element={Reciepts} />} />
            <Route path="/main/employees" element={<PrivateRoute element={Employee} />} />
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
