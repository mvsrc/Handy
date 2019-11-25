import { combineReducers } from 'redux';
const INITIAL_STATE = {loading:false,userData:null,error:null,authorized:false};
const reducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'USER_SIGNIN':
            return processUserSignIn(state, action);
        case 'CHECK_AUTH':
            return processCheckAuthentication(state,action);
        case 'LOADING_CHANGE':
            return changeLoadingStatus(state,action);
        default:
            return state
    }
};
export default combineReducers({
    reducer
});
processUserSignIn = async (state, action) => {
    return {
        ...state,
        userData:action.userData,
        authorized: true,
    };
}
processCheckAuthentication = (state,action)=>{
    let dataSet = action.payload;
    return {
        ...state,
        userData:dataSet.userData,
        authorized:dataSet.authorized
    }
}
changeLoadingStatus = (state,action)=>{
    state['loading'] = action.loading;
    return {
        ...state
    }
}