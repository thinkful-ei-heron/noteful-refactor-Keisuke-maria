import React from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import NotefulContext from '../NotefulContext'
import './Note.css'

function deleteNoteRequest(noteId, callback) {
  fetch(`http://www.localhost:9090/notes/${noteId}`, {method: 'DELETE'})
  .then(response => {
    if (!response.ok){
      throw Error('error here')
    }
    return response
  })
  .then( response => response.json())
  .then(data => {
    callback(noteId)
  })
  .catch(error => {
    console.error(error)
  })
}

export default function Note(props) {
  return (
    <NotefulContext.Consumer>
      {(context) => (
        <div className='Note'>
          <h2 className='Note__title'>
            <Link to={`/note/${props.id}`}>
              {props.name}
            </Link>
          </h2>
          <button className='Note__delete' type='button' onClick={() => {
            deleteNoteRequest(props.id, context.deleteNote)
            if (props.notePageMain) {
              props.history.push('/')
            }
            }
          }>
            <FontAwesomeIcon icon='trash-alt' />
            {' '}
            remove
          </button>
          <div className='Note__dates'>
            <div className='Note__dates-modified'>
              Modified
              {' '}
              <span className='Date'>
                {format(props.modified, 'Do MMM YYYY')}
              </span>
            </div>
          </div>
        </div>
      )}
    </NotefulContext.Consumer>
  )
}
