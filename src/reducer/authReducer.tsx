// reducers/authReducer.js
const initialState = {
    token: localStorage.getItem('token') || null, // Initialise le token depuis le localStorage
    error: null,
  };
  
  const authReducer = (state = initialState, action:any) => {
    switch (action.type) {
      case 'SET_TOKEN':
        return {
          ...state,
          token: action.payload,
        };
      case 'CLEAR_TOKEN':
        return {
          ...state,
          token: null,
        };
      case 'SET_ERROR':
        return {
          ...state,
          error: action.payload,
        };
      case 'CLEAR_ERROR':
        return {
          ...state,
          error: null,
        };
      default:
        return state;
    }
  };
  
  export default authReducer;
  