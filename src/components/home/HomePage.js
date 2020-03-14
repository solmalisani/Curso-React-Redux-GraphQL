import React from 'react'
import Card from '../card/Card'
import styles from './home.module.css'
import { connect } from 'react-redux'
import { removeCharacterAction, addToFavAction } from './../../redux/charsDuck'

function Home( {chars, removeCharacterAction, addToFavAction} ) {
    function renderCharacter() {
        let char = chars[0]
        return (
            <Card 
            rightClick = {addFav}
            leftClick={nextCharacter} 
            {...char} 
            />
        )
    }

    function nextCharacter(){
        removeCharacterAction()
    }

    function addFav(){
        addToFavAction()
    }

    return (
        <div className={styles.container}>
            <h2>Personajes de Rick y Morty</h2>
            <div>
                {renderCharacter()}
            </div>
        </div>
    )
}

function mapState(state){
    return{
        chars: state.characters.array
    }
}

export default connect(mapState, {removeCharacterAction, addToFavAction})(Home)