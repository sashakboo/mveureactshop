import { Routes , Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ProductsPage from './pages/ProductsPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminPage from './pages/AdminPage';

export const useRoutes = (isAuthenticated: boolean) => {
    if (!isAuthenticated) {
        return (
            <Routes>
                <Route path="/auth" element={<LoginPage />} />
                <Route path="*" element={<Navigate to="/auth" />}/>
            </Routes>
        )    
    }
    
    return (
        <Routes>
            <Route path="/filter/cat/:id" element={<ProductsPage />}/>
            <Route path="/auth" element={<Navigate to="/" />} />
            <Route path="/basket" element={<CheckoutPage />}></Route>
            <Route path="/admin" element={<AdminPage />}></Route>
            <Route path="/" element={<ProductsPage />}/>
            <Route path="*" element={<Navigate to="/" />}/>
        </Routes>
    )
    
}