import React, { useEffect, useState } from 'react';
import "../App.css";
import registerLogo from '../assets/img/logoSU.png';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserService from '../services/UserService';

const predefinedUsers = [
    { id: 1, email: 'admin@example.com', password: 'admin123', role: 'Admin / Directeur' },
    { id: 2, email: 'suiveur@example.com', password: 'suiveur123', role: 'Suiveur' },
    { id: 3, email: 'tuteur@example.com', password: 'tuteur123', role: 'Tuteur' },
    { id: 4, email: 'pedagogique@example.com', password: 'pedagogique123', role: 'Responsable pédagogique' },
    { id: 5, email: 'cre@example.com', password: 'cre123', role: 'Responsable relations entreprises (Cre)' }
];

const LoginScreen: React.FC = () => {
    const [disableScroll, setDisableScroll] = useState(true);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();
    const [token, setToken] = useState<string>('');

    // stocker le token dans le local storage
    useEffect(() => {
        localStorage.setItem('token', token);
        console.log('token', token);
    }
    , [token]);

    useEffect(() => {
        const fetchAllUser  = async () => {
          try{
            const response = await UserService.getUsers();
            console.log(response);
          } catch (error) {
            console.error(error);
          }
        }  
        fetchAllUser();
      } , [token]);

    // const { login } = useAuth();

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
        let Email = email;
        let Mot_De_Passe = password;
        UserService.login({ Email, Mot_De_Passe }).then((response) => {
            console.log(response);
            if (response && response.status === 200) {
                setToken(response.data?.token);
                navigate('/gestion-comptes');
            } else {
                setError('Email ou mot de passe incorrect');
            }
        }).catch((error) => {
            console.error(error);
            setError('Email ou mot de passe incorrect');
        });

        // if (!email || !password) {
        //     setError('Veuillez entrer votre email et mot de passe');
        //     return;
        // }

        // const user = predefinedUsers.find(user => user.email === email && user.password === password);

        // if (!user) {
        //     setError('Email ou mot de passe incorrect');
        //     return;
        // }

        // login(user);
        
        // Navigate based on user role
        // switch (user.role) {
        //     case 'Admin / Directeur':
        //         navigate('/gestion-comptes');
        //         break;
        //     case 'Suiveur':
        //         navigate('/rdv');
        //         break;
        //     case 'Tuteur':
        //     case 'Responsable pédagogique':
        //     case 'Responsable relations entreprises (Cre)':
        //         navigate('/home');
        //         break;
        //     default:
        //         navigate('/home');
        //         break;
        // }
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
