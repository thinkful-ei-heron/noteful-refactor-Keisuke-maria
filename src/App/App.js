import React, {Component} from 'react';
import {Route, Link} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import NoteListNav from '../NoteListNav/NoteListNav';
import NotePageNav from '../NotePageNav/NotePageNav';
import NoteListMain from '../NoteListMain/NoteListMain';
import NotePageMain from '../NotePageMain/NotePageMain';
import {getNotesForFolder, findNote, findFolder} from '../notes-helpers';
import NotefulContext from '../NotefulContext';
import './App.css';

class App extends Component {
    state = {
        notes: [],
        folders: []
    };

    deleteNote = noteId => {
        const newNotes = this.state.notes.filter(note => note.id !== noteId)
        this.setState({notes: newNotes})
    }

    componentDidMount() {
        fetch('http://www.localhost:9090/folders')
        .then(response => {
            if(!response.ok){
                throw new Error('ahhhh')
            }
            return response
        })
        .then(response => response.json())
        .then(data => {
            this.setState({folders: data})
        })
        .catch(error => {
            console.log('error handling ', error)
        })

        fetch('http://www.localhost:9090/notes')
        .then(response => {
            if(!response.ok){
                throw new Error('ahhhh')
            }
            return response
        })
        .then(response => response.json())
        .then(data => {
            this.setState({notes: data})
        })
        .catch(error => {
            console.log('error handling ', error)
        })
        // fake date loading from API call
        //setTimeout(() => this.setState(dummyStore), 600);
    }

    renderNavRoutes() {
        const contextValue = {
            notes: this.state.notes,
            folders: this.state.folders
        }
        const {notes, folders} = this.state;
        return (
            <NotefulContext.Provider value={contextValue}>
                {['/', '/folder/:folderId'].map(path => (
                    <Route
                        exact
                        key={path}
                        path={path}
                        render={routeProps => (
                            <NoteListNav
                                //folders={folders}
                                //notes={notes}
                                {...routeProps}
                            />
                        )}
                    />
                ))}
                <Route
                    path="/note/:noteId"
                    render={routeProps => {
                        const {noteId} = routeProps.match.params;
                        const note = findNote(notes, noteId) || {};
                        const folder = findFolder(folders, note.folderId);
                        return <NotePageNav {...routeProps} folder={folder} />;
                    }}
                />
                <Route path="/add-folder" component={NotePageNav} />
                <Route path="/add-note" component={NotePageNav} />
            </NotefulContext.Provider>
        );
    }

    renderMainRoutes() {
        const contextValue = {
            notes: this.state.notes,
            folders: this.state.folders,
            deleteNote: this.deleteNote
        }
        return (
            <NotefulContext.Provider value={contextValue}>
                {['/', '/folder/:folderId'].map(path => (
                    <Route
                        exact
                        key={path}
                        path={path}
                        render={routeProps => {
                            const {folderId} = routeProps.match.params;
                            const notesForFolder = getNotesForFolder(
                                contextValue.notes,
                                folderId
                            );
                            return (
                                <NoteListMain
                                    {...routeProps}
                                    notes={notesForFolder}
                                />
                            );
                        }}
                    />
                ))}
                <Route
                    path="/note/:noteId"
                    render={routeProps => {
                        const {noteId} = routeProps.match.params;
                        const note = findNote(contextValue.notes, noteId);
                        return <NotePageMain {...routeProps} note={note} />;
                    }}
                />
            </NotefulContext.Provider>
        );
    }

    render() {
        return (
            <div className="App">
                <nav className="App__nav">{this.renderNavRoutes()}</nav>
                <header className="App__header">
                    <h1>
                        <Link to="/">Noteful</Link>{' '}
                        <FontAwesomeIcon icon="check-double" />
                    </h1>
                </header>
                <main className="App__main">{this.renderMainRoutes()}</main>
            </div>
        );
    }
}

export default App;
