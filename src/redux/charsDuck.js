import ApolloClient, {gql} from 'apollo-boost'
import { updateDB , getFavs} from '../firebase'

//constantes
let initialData = {
    fetching: false,
    array: [],
    current: {},
    favorites: []
}

//let URL = "https://rickandmortyapi.com/api/character"

let client = new ApolloClient({
    uri:"https://rickandmortyapi.com/graphql"
})

//hago estos tres tipos cuando me comunico con el backend
let GET_CHARACTERS = 'GET_CHARACTERS'
let GET_CHARACTERS_SUCCESS = 'GET_CHARACTERS_SUCCESS'
let GET_CHARACTERS_ERROR = 'GET_CHARACTERS_ERROR'
//si no me comunico con el backend no pongo las 3
let REMOVE_CHARACTER = 'REMOVE_CHARACTER'

let ADD_TO_FAVORITES = "ADD_TO_FAVORITES"

let GET_FAVS = 'GET_FAVS'
let GET_FAVS_SUCCESS = 'GET_FAVS_SUCCESS'
let GET_FAVS_ERROR = 'GET_FAVS_ERROR'

//reducer
export default function reducer(state=initialData, action){
    switch(action.type){
        case REMOVE_CHARACTER:
            return {...state, array: action.payload}
        case GET_CHARACTERS:
            return {...state, fetching:true}
        case GET_CHARACTERS_ERROR:
            return {...state, fetching: false, error: action.payload}
        case GET_CHARACTERS_SUCCESS:
            return {...state, array:action.payload, fetching: false}

        case ADD_TO_FAVORITES:
            return {...state, ...action.payload}

        case GET_FAVS:
            return {...state, fetching:true}
        case GET_FAVS_ERROR:
            return {...state, fetching: false, error: action.payload}
        case GET_FAVS_SUCCESS:
            return {...state, favorites:action.payload, fetching: false}

        default:
            return state
    }
}

//actions (thunk)
// export let getCharactersAction = () => (dispatch, getState) => {
//     dispatch({  
//         type: GET_CHARACTERS
//     })
      
//     return axios.get(URL)
//         .then(res => {
//             dispatch({
//                 type: GET_CHARACTERS_SUCCESS,
//                 payload: res.data.results
//             })
//         })
// }

export let retrieveFavs = () => (dispatch, getState) => {
    dispatch({
        type: GET_FAVS
    })
    let {uid} = getState().user
    return getFavs(uid)
    .then(array =>{
        dispatch({
            type: GET_FAVS_SUCCESS,
            payload: [...array]
        })
    })
    .catch(e =>{
        console.log(e)
        dispatch({
            type: GET_FAVS_ERROR,
            payload: e.message
        })
    })
}

 
export let getCharactersAction = () => (dispatch, getState) =>{
    let query = gql`
    {
        characters{
            results{
                name
                image
            }
        }
    }
    `
    dispatch({
        type: GET_CHARACTERS
    })  
    return client.query({
        query
    })
    .then(({data, error})=>{
        if(error){
            dispatch({
                type:GET_CHARACTERS_ERROR,
                payload: data.characters.results
            })
            return
        }
        else{
            dispatch({
                type:GET_CHARACTERS_SUCCESS,
                payload: data.characters.results
            })
        }

    })
}

export let removeCharacterAction = () => (dispatch, getState) => {
    //traigo info del store a traves del getstate
    let {array} = getState().characters
    array.shift()
    dispatch({
        type: REMOVE_CHARACTER,
        payload: [...array]
    })
}

export let addToFavAction = () => (dispatch, getState) => {
    let {array, favorites} = getState().characters
    let {uid} = getState().user
    let char = array.shift()
    favorites.push(char)

    updateDB(favorites, uid)

    dispatch({
        type: ADD_TO_FAVORITES,
        payload: { array: [...array], favorites: [...favorites]}
    })
}