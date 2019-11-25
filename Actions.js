export const actionUserSignIn = (userData) => {
    return {
        type: 'USER_SIGNIN',
        payload: userData
    };
};
export const checkAuthentication = (dataSet) => {
    return {
        type: 'CHECK_AUTH',
        payload: dataSet
    };
};
export const loadingChange = (loading)=>{
    return {
        type:'LOADING_CHANGE',
        loading
    }
}