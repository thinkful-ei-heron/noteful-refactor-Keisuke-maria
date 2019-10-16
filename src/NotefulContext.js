import React from 'react'

const NotefulContext = React.createContext({
  notes: [],
  folder:[],
  deleteNote: () => {}
});

export default NotefulContext