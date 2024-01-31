import NavBar from './components/NavBar';
import Footer from './components/Footer';
import { useRoutes } from './Routes';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { useAuth } from './hooks/auth.hook';
import { NotifyContext } from './context/NotifyContext';
import { useNotify } from './hooks/notify.hook';
import './App.css';

function App() {
  const { token, login, logout, userId } = useAuth();
  const isAuthenticated = !!token;  
  const routes = useRoutes(isAuthenticated);
  const { basketCount, changeBasketCount, resetBasketCount } = useNotify(); 

  return (
    <BrowserRouter>
      <div className="container-fluid">
        <main>
            <AuthContext.Provider value={{
              token, login, logout, userId, isAuthenticated
            }}>
              <NotifyContext.Provider value={{basketCount, changeBasketCount, resetBasketCount}}>
                  <NavBar />
                  <div className="container-fluid">
                    {routes}
                  </div>
              </NotifyContext.Provider>
            </AuthContext.Provider>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
