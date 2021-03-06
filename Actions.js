export const actionUserSignIn = (userData,userToken) => {
    return {
        type: 'USER_SIGNIN',
        userData,
        userToken
    };
};
export const checkAuthentication = (dataSet) => {
    return {
        type: 'CHECK_AUTH',
        dataSet
    };
};
export const loadingChange = (loading)=>{
    return {
        type:'LOADING_CHANGE',
        loading
    }
}
export const LogoutAction = ()=>{
    return {
        type:'LOGOUT_ACTION',
        userData:null
    }
}
export const updateProfileAction = (userData)=>{
    return {
        type:'UPDATE_PROFILE',
        userData
    }
}
export const showWelcomeMessageAction = (showWelcomeMessage)=>{
    return {
        type:'SHOW_WELCOME_MESSAGE',
        showWelcomeMessage
    }
}
export const SetLanguageAction = (lang)=>{
    return {
        type:'SET_LANGUAGE',
        lang
    }
}

export const checkUserStatusAction = (userData)=>{
    return {
        type:'CHECK_USER_STATUS',
        userData
    }
}
export const setProDistrictIdAction = (proDistrictId)=>{
    return {
        type:'SET_PRO_DISTRICT_ID',
        proDistrictId
    }
}
export const setUsernamePasswordAction = (credentialList)=>{
    return {
        type:'SET_USERNAME_PASSWORD',
        credentialList
    }
}