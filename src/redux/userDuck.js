import { loginWithgoogle, signOutGoogle } from '../firebase'
import {retrieveFavs} from './charsDuck'

//constantes
let initialData = {
    loggedIn: false,
    fetching: false
}

let LOGIN = "LOGIN"
let LOGIN_SUCCESS = "LOGIN_SUCCESS"
let LOGIN_ERROR = "LOGIN_ERROR"

let LOG_OUT = "LOG_OUT" 

//reducer
export default function reducer(state = initialData, action){
    switch(action.type){
        case LOGIN:
            return {...state, fetching: true}
        case LOGIN_ERROR:
            return {...state, fetching:false, error: action.payload}   
        case LOGIN_SUCCESS:
            return {...state, fetching:false, ...action.payload, loggedIn: true} 
        case LOG_OUT:
            return {...initialData}
        default: 
            return state
    }
}

//aux
function saveStorage(storage) {
    localStorage.storage = JSON.stringify(storage)
}

//actions
export let logOutAction = () => (dispatch, getState) =>  {
     signOutGoogle()
     dispatch({
         type: LOG_OUT
     })
     localStorage.removeItem('storage')
}

export let restoreSessionAction = () => dispatch =>{
    let storage = localStorage.getItem('storage')
    storage = JSON.parse(storage)
    if(storage && storage.user){
        dispatch({
            type:LOGIN_SUCCESS,
            payload: storage.user
        })
    }
}

export let doGoogleLoginAction = () => (dispatch, getState) => {
    dispatch({ 
        type: LOGIN
    })

    return loginWithgoogle()
        .then(user =>{
            dispatch({
                type: LOGIN_SUCCESS,
                payload: {
                    uid: user.uid,
                    displayName: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL
                }
            })
            saveStorage(getState())
            retrieveFavs()(dispatch, getState)
        })
        .catch(e=>{
            console.log(e)
            dispatch({
                type:LOGIN_ERROR,
                payload: e.message
            })
        })
}