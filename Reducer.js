import { combineReducers } from 'redux';
const INITIAL_STATE = { loading: false, userData: null, error: null, authorized: false, showWelcomeMessage: false, lang: '' };
const reducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'USER_SIGNIN':
            return processUserSignIn(state, action);
        case 'CHECK_AUTH':
            return processCheckAuthentication(state, action);
        case 'LOADING_CHANGE':
            return changeLoadingStatus(state, action);
        case 'LOGOUT_ACTION':
            return processUserSignOut(state, action);
        case 'UPDATE_PROFILE':
            return processUpdateProfile(state, action);
        case 'SHOW_WELCOME_MESSAGE':
            return processWelcomeMessage(state, action);
        case 'SET_LANGUAGE':
            return setLanguage(state, action);
        default:
            return state
    }
};
export default combineReducers({
    reducer
});
processUserSignIn = (state, action) => {
    return {
        ...state,
        userData: action.userData,
        authorized: true,
    };
}
processCheckAuthentication = (state, action) => {
    let dataSet = action.dataSet;
    return {
        ...state,
        userData: dataSet.userData,
        authorized: dataSet.authorized,
        lang:dataSet.lang
    }
}
changeLoadingStatus = (state, action) => {
    state['loading'] = action.loading;
    return {
        ...state
    }
}
processUserSignOut = (state, action) => {
    return {
        ...state,
        userData: null,
        authorized: false,
        lang:''
    };
}
processUpdateProfile = (state, action) => {
    return {
        ...state,
        userData: action.userData,
    };
}
processWelcomeMessage = (state, action) => {
    return {
        ...state,
        showWelcomeMessage: action.showWelcomeMessage
    }
}
setLanguage = (state, action) => {
    return {
        ...state,
        lang: action.lang
    }
}