import React, { useEffect, useState } from 'react';
import "../App.css";
import registerLogo from '../assets/img/logoSU.png';
import { Link } from 'react-router-dom';

const LoginScreen: React.FC = () => {
    const [companyCode, setCompanyCode] = React.useState<string>('');
    const [disableScroll, setDisableScroll] = useState(true);
    
    const [email, setEmail] = React.useState<string>('');
    const [password, setPassword] = React.useState<string>('');
    const [token, setToken] = React.useState<string>('');

    useEffect(() => {
        if (disableScroll == true) {
            document.body.classList.add('disable-scroll');
        }
        
        return () => {
            document.body.classList.remove('disable-scroll');
        };
    }, [disableScroll]);



    return (
        <div className='container-register' style={{paddingBottom:"100%"}} >
            <div className='Form'>
                <div className='form-container'>
                    <div className='register-form'>
                    <img src={registerLogo} className='register-img' alt="" />
                    <h2 className=''>Se connecter</h2>
                       <div className='register-item'>
                            {/* <FontAwesomeIcon icon={faEnvelope} /> */}
                            <input className='input-register' onChange={(e)=> setEmail(e.target.value)} type="text"  placeholder='Votre Mail'/>
                       </div>

                       <div className='register-item'>
                            {/* <FontAwesomeIcon icon={faUser} /> */}
                            <input className='input-register' onChange={(e)=> setPassword(e.target.value)} type="text"  placeholder='Votre Mot de passe'/>
                       </div>

                        <Link to='/register/validate'>
                            <button className='register-button' onClick={() =>{} } type='button'>Se connecter</button>
                        </Link>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default LoginScreen;