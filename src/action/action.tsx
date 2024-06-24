// actions/authActions.js
export const setTokenAction = (token:string) => {
    localStorage.setItem('token', token); // Enregistre le token dans le localStorage
    return {
      type: 'SET_TOKEN',
      payload: token,
    };
  };
  
  export const clearTokenAction = () => {
    localStorage.removeItem('token'); // Supprime le token du localStorage
    return {
      type: 'CLEAR_TOKEN',
    };
  };