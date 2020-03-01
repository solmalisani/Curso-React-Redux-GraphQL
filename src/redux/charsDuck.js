import axios from 'axios'
import ApolloClient, {gql} from 'apollo-boost'

//constantes
let initialData = {
    fetching: false,
    array: [],
    current: {}
}

let URL = "https://rickandmortyapi.com/api/character"

let client = new ApolloClient({
    uri:"https://rickandmortyapi.com/graphql"
})

//hago estos tres tipos cuando me comunico con el backend
let GET_CHARACTERS = 'GET_CHARACTERS'
let GET_CHARACTERS_SUCCESS = 'GET_CHARACTERS_SUCCESS'
let GET_CHARACTERS_ERROR = 'GET_CHARACTERS_ERROR'
//si no me comunico con el backend no pongo las 3
let REMOVE_CHARACTER = 'REMOVE_CHARACTER'

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
