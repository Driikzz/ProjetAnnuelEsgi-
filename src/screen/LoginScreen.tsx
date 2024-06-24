import React, { useEffect, useState } from 'react';
import "../App.css";
import registerLogo from '../assets/img/logoSU.png';
import { Link, useNavigate } from 'react-router-dom';
import UserService from '../services/UserService';
import { useDispatch, useSelector } from 'react-redux';
import { setTokenAction } from '../action/action';

const LoginScreen: React.FC = () => {
    const [disableScroll, setDisableScroll] = useState(true);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [tokenUser, setTokenUsers] = useState(''); 
    const navigate = useNavigate();

    const dispatch = useDispatch();

    const token = useSelector((state:any) => state.auth.token);

    // Store the token in local storage
    useEffect(() => {
        localStorage.setItem('token', token);
        console.log('token', token);
    }, [token]);

    useEffect(() => {
        if (disableScroll) {
            document.body.classList.add('disable-scroll');
        } else {
            document.body.classList.remove('disable-scroll');
        }

        return () => {
            document.body.classList.remove('disable-scroll');
        };
    }, [disableScroll]);

    const handleLogin = () => {
        UserService.login({ email, password }).then((response) => {
            console.log(response);
            if (response && response.status === 200) {
                const token = response.data;
                dispatch(setTokenAction(token));
                setTokenUsers(token);
                navigate('/gestion-comptes'); 
            } else {
                setError('Email ou mot de passe incorrect');
            }
        }).catch((error) => {
            console.error(error);
            setError('Email ou mot de passe incorrect');
        });
    };

    return (
        <div className='container-register'>
            <div className='Form'>
                <div className='form-container'>
                    <div className='register-form'>
                        <img src={registerLogo} className='register-img' alt="Logo" />
                        <h2>Se connecter</h2>

                        {error && <div className='error-message'>{error}</div>}

                        <div className='register-item'>
                            <input
                                className='input-register'
                                onChange={(e) => setEmail(e.target.value)}
                                type="text"
                                placeholder='Votre Mail'
                                value={email}
                            />
                        </div>

                        <div className='register-item'>
                            <input
                                className='input-register'
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                placeholder='Votre Mot de passe'
                                value={password}
                            />
                        </div>

                        <button className='register-button' onClick={handleLogin} type='button'>
                            Se connecter
                        </button>

                        <div className='register-item'>
                            <Link to='/forgot-password'>Mot de passe oublié?</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;
