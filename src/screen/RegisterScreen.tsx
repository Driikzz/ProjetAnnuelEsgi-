import React, { useEffect, useState } from 'react';
import "../App.css";
import { Link } from 'react-router-dom';
import registerLogo from '../assets/img/logoSU.png';

const RegisterScreen: React.FC = () => {
    const [companyCode, setCompanyCode] = React.useState<string>('');
    const [disableScroll, setDisableScroll] = useState(true);

    useEffect(() => {
        if (disableScroll == true) {
            document.body.classList.add('disable-scroll');
        }
        
        return () => {
            document.body.classList.remove('disable-scroll');
        };
    }, [disableScroll]);


    return (
        <div className='container-register' style={{paddingBottom:"100%"}}>
            <div className='Form'>
                <div className='form-container'>
                    <div className='register-form'>
                    <img src={registerLogo} className='register-img' alt="" />
                    <h2 className=''>Créer un compte</h2>
                       <div className='register-item'>
                            {/* <FontAwesomeIcon icon={faUser} /> */}
                            <input className='input-register' type="text"  placeholder='Votre Prénom'/>
                       </div>

                       <div className='register-item'>
                            {/* <FontAwesomeIcon icon={faUser} /> */}
                            <input className='input-register' type="text"  placeholder='Votre Nom'/>
                       </div>

                       <div className='register-item'>
                            {/* <FontAwesomeIcon icon={faEnvelope} /> */}
                            <input className='input-register' type="text"  placeholder='Votre Mail'/>
                       </div>

                       <div className='register-item'>
                            {/* <FontAwesomeIcon icon={faUser} /> */}
                            <input className='input-register' type="text"  placeholder='Votre Mot de passe'/>
                       </div>

                        <div className='register-item'>
                            {/* <FontAwesomeIcon icon={faKey} /> */}
                            <input className='input-register' type="text"  placeholder='Confirmer votre Mot de passe'/>
                        </div>

                        <div className='register-item'>
                            <input className='checkbox-register' type='checkbox' />
                            <label>Accepter les <a href=""> conditions d'utilisation </a> et les <a href=''>CGU</a></label>
                        </div>

                        <Link to='/register/validate'>
                            <button className='register-button' type='button'>S'inscrire</button>
                        </Link>


                    </div>
                </div>

            </div>
        </div>
    );
};

export default RegisterScreen;