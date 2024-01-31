import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/http.hook';
import { Loader } from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

export default function LoginPage() {
    const auth = useContext(AuthContext);
    const {loading, request, error, clearError} = useHttp();
    const [form, setForm] = useState({
      email: '',
      password: ''
    });

    const changeHandler = (event: React.FormEvent<HTMLInputElement>) => {
        setForm({ ...form, [event.currentTarget.name]: event.currentTarget.value });
    }

    const registerHandler = async () => {
        try {
          const data = await request('/api/auth/register', 'POST', JSON.stringify({...form}));
          auth.login(data.token, data.userId);
        } catch (e) {
          
        }
      }
    
      const loginHandler = async () => {
        try {
          const data = await request('/api/auth/login', 'POST', JSON.stringify({...form}));
          auth.login(data.token, data.userId);
        } catch (e) {
          
        }
      }    

    return (
        <div className="container" style={{maxWidth: `500px`}}>
            { loading && <Loader /> }
            <h3  className="mb-3">
                Авторизация
            </h3>
            <form>
                {/* Email input */}
                <div className="form-outline mb-3">
                    <input 
                        placeholder="Введите email" 
                        id="email" 
                        type="text"
                        name="email" 
                        className="form-control"
                        value={form.email}
                        onChange={changeHandler} />  
                    <label className="form-label" htmlFor="loginName">Email</label>
                </div>

                {/* Password input */}
                <div className="form-outline mb-3">
                    <input 
                        placeholder="Введите пароль" 
                        id="password" 
                        type="password"
                        name="password"
                        className="form-control" 
                        value={form.password}
                        onChange={changeHandler} />
                    <label className="form-label" htmlFor="loginPassword">Пароль</label>
                </div>

                {/* Submit button */}
                <button 
                    className="btn btn-primary btn-block mb-3" 
                    onClick={loginHandler}
                    disabled={loading}>
                    Войти
                </button>
                <button 
                    className="btn btn-primary btn-block ms-3 mb-3"
                    onClick={registerHandler}  
                    disabled={loading} >
                    Регистрация
                </button>
            </form>
            { error != null && <ErrorMessage message={error} close={clearError} /> }
        </div>
    )
}