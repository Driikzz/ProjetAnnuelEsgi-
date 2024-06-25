export const signInSuccess = (userData: any) => {
  return {
    type: 'SIGN_IN_SUCCESS',
    payload: userData,
  };
};