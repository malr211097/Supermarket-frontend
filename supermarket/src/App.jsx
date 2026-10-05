import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout.jsx'
import HomePage from './pages/HomePage.jsx'
import UsersPage from './pages/UsersPage.jsx'
import ProductsPage from './pages/ProductsPage.jsx'
import ProvidersPage from './pages/ProvidersPage.jsx'
import SalesPage from './pages/SalesPage.jsx'

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/providers" element={<ProvidersPage />} />
          <Route path="/sales" element={<SalesPage />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  )
}

export default App