import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import brand from '../resources/brand.jpg'
import basket from '../resources/basket.png'
import { useHttp } from '../hooks/http.hook';
import { NotifyContext } from '../context/NotifyContext';

export default function NavBar() {
    const { request } = useHttp();
    const { token, userId, logout } = useContext(AuthContext);
    const isAuthenticated = !!token;    
    const [ isAdmin, setIsAdmin] = useState(false);

    const fetchUserRole = async () => {
        try {
            if (!isAuthenticated || Number.isNaN(userId))
              return;

            const apiUrl = `/api/auth/role/${userId as number}`;
            const response = await request(apiUrl, 'GET', null, { Authorization: `Bearer ${token}` });
            const data = response as any;
            setIsAdmin(data.role === 'admin');    
        } catch (e) { }
    }

    useEffect(() => {
        fetchUserRole();
    }, [token]);

    const { basketCount, changeBasketCount, resetBasketCount } = useContext(NotifyContext);
    const getBasketCount = async () => {
        try {
          if (!isAuthenticated)
            resetBasketCount();

          if (isAuthenticated && basketCount === 0) {
            const apiUrl = '/api/basket/count';
            const response = await request(apiUrl, 'GET', null, { Authorization: `Bearer ${token}` });
            const data = parseInt(response);
            if (!Number.isNaN(data))
              resetBasketCount();
              changeBasketCount(data); 
          }   
        } catch (e) { }
    }
    useEffect(() => { getBasketCount(); }, [ isAuthenticated ]);

    return (
        <div className="fixed-top">
            <nav className="navbar fixed-top navbar-expand navbar-light bg-white">
                <div className="container">    
                    <Link className="navbar-brand mt-2 mt-sm-0" to="/">
                        <img src={brand} height="45" alt="Logo" />
                    </Link>
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item active">
                            <Link className="nav-link " to="/">Домой</Link>
                        </li>
                    </ul>
                    <div className="d-flex align-items-center">
                        {
                            isAuthenticated && (
                            <Link className="nav-link me-3" to="/basket">
                                <img className="fas fa-shopping-cart" src={basket} alt="basket" />
                                <span className="badge rounded-pill badge-notification bg-danger">{ basketCount }</span>
                            </Link>)
                        }
                        { isAdmin && isAuthenticated &&
                            (<Link className="border rounded px-2 nav-link mx-2" to="/admin">
                                <i className="fab me-2"></i>Администрирование
                            </Link>)
                        }
                        {isAuthenticated && 
                            (<Link to="/auth" className="border rounded px-2 nav-link mx-2" onClick={logout}>
                                <i className="fab me-2"></i>Выйти
                            </Link>)}                        
                    </div>
                    {/* Right elements */}
                
                </div>
                {/* Container wrapper */}
            </nav>
            {/* Navbar */}  
        </div>
    );
}