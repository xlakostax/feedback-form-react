import axios from 'axios';
import firebaseConf from './Firebase';
import { loadProgressBar } from 'axios-progress-bar'
import Modal from 'react-modal';
import React, { Component } from 'react';

import styled from 'styled-components';

import './Form.css';
import 'axios-progress-bar/dist/nprogress.css';

const Wrapper = styled.section`
  position: relative;
  margin: 10% 20%;
  width: 60%;
  & form {
    margin-bottom: 1em;
  }
  & span {
    color: rgb( 255, 99, 71 )
  }
  & input, textarea {
    display: block;
    width: 100%;
    height: 2em;
    margin: 0 0 1em 0;
    border-radius: 5px 5px;
    border: 1px solid rgba( 220, 220, 220, 1 );
  }
  & textarea {
    height: 10em;
  }
  & button {
    position: relative;
    padding: 1em;
    background-color: transparent;
    height: 4em;
    width: 6em;
    border-radius: 5px 5px;
    border: 1px solid rgba( 47, 47, 47, 1 );
    text-transform: uppercase;
  }
  & button:hover {
    cursor: pointer;
    color: rgb( 255, 99, 71 );
    border: 1px solid rgb( 255, 99, 71 );
  }
  & form > div {
    display: flex;
    align-items: center;
  }
  & .grid {
    position: relative;
    display: grid;
    grid-template-columns: 1fr;
    width: 100%;
    background-color: rgb( 255, 255, 255 );
  }
  & .card-inGrid {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 1em;
    overflow-wrap: break-word;
    border-bottom: 1px solid black;
    &:last-child {
      border-bottom: 0 solid black;
    }
  }
`;

export default class Form extends Component {
  constructor( props ) {
    super( props );
    this.state = {
        name: '',
        email: '',
        message: '',
        messagesHistory: [],
        showModalSuccess: false,
        showModalError: false,
        disabled: false
    };
    this.onSubmitHandler = this.onSubmitHandler.bind( this );
    this.onChangeHandler = this.onChangeHandler.bind( this );
    this.resetForm = this.resetForm.bind(this);
    this.handleCloseModalSuccess = this.handleCloseModalSuccess.bind( this );
    this.handleCloseModalError = this.handleCloseModalError.bind( this );
    this.updateList = this.updateList.bind( this );
  }

  componentWillMount = () => {
    this.updateList();
    loadProgressBar();
  }

  updateList = () => {
    /* Create a reference to messages in the Firebase Database.
    The reference represents a specific location in the Database,
    and can be used for reading or writing data to that Database location. */
    let messagesRef = firebaseConf.database().ref();
    /* Firebase offers several different event types for reading data.

    child_added

    This event type will be triggered once for every message and every time
    a new message is added to the Database.  */
    messagesRef.on( 'child_added', ( snapshot ) => {
      /* snapshot.val() contains an object of objects from the Database:
      { {}, {}, ... , {} } */
      let obj = snapshot.val();
      // console.log( obj )
      for (let key in obj) {
         obj[ key ][ 'id' ] = key;
      }

      let messHistory = [];
      for (let key in obj) {
          messHistory.push( obj[ key ] )
      }
      // console.log( messHistory )
      this.setState( {
         messagesHistory: messHistory
      })
      // console.log( this.state.messagesHistory )
    });
  }

  onChangeHandler = ( event ) => {
    let name = event.target.name;
    let value = event.target.value;

    this.setState({
        [name]: value, /* The ES6 computed property name syntax is used to update the state key corresponding to the given input name:*/
    });
  }

  onSubmitHandler = ( event ) => {
    event.preventDefault(); /* Prevent form submit from reloading the page */

    this.setState({ disabled: true })

    let name = this.state.name;
    let email = this.state.email;
    let message = this.state.message;
    let formObj = {
        name: name,
        email: email,
        message: message
    };
    let axiosConfig = { /* Config headers to avoid CORS issues */
      headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          "Access-Control-Allow-Origin": "*"
      }
    };

    firebaseConf.database().ref('messages').child(Date.now()).set( /* Set up a unique key value in DB */
        formObj
    );

    this.updateList();

    axios
    .post( 'https://us-central1-react-feedback-form.cloudfunctions.net/app', formObj, axiosConfig ) /* POST request by axios to the function */
    .then( ( res ) => {
        // console.log( res.status )
        if ( res.data.msg === 'success' ) {
            this.resetForm();
            this.setState({ display: 'none', showModalSuccess: true });
        } else if ( res.data.msg === 'fail' || res.status !== 200 ) {
            this.setState({ display: 'none', showModalError: true });
        }
    })
  }

  resetForm = () => {
    this.setState({
        name: '',
        email: '',
        message: ''
    });
  }

  handleCloseModalSuccess = () => {
    this.setState({
      showModalSuccess: false,
      disabled: false
     })
  }

  handleCloseModalError = () => {
    this.setState({
      showModalSuccess: false,
      disabled: false
     })
  }

  render() {

    const history = this.state.messagesHistory.map( ( element ) => {
        return (
          <div className = 'card-inGrid'>
            <p key = { element.id }> <b>Name:</b> { element.name } </p>< br/>
            <p key = { element.id }> <b>E-Mail:</b> { element.email } </p>< br/>
            <p key = { element.id }> <b>Message:</b> { element.message } </p>< br/>
          </div>
        )
    })

    return(
      <Wrapper className = 'wrapper'>
        <Modal
            isOpen = { this.state.showModalSuccess }
            contentLabel = 'onRequestClose'
            onRequestClose = { this.handleCloseModalSuccess }
            className = 'Modal'
            overlayClassName = 'Overlay'
            shouldCloseOnOverlayClick = { false }
        >
          <i className = 'fas fa-times' onClick = { this.handleCloseModalSuccess }  style = {{ cursor: 'pointer', margin: '10px' }}></i>
          <p>Your message was sent <span>successfully</span>.</p>
        </Modal>
        <Modal
            isOpen = { this.state.showModalError }
            contentLabel = 'onRequestClose'
            onRequestClose = { this.handleCloseModalError }
            className = 'Modal'
            overlayClassName = 'Overlay'
            shouldCloseOnOverlayClick = { false }
        >
          <i className = 'fas fa-times' onClick = { this.handleCloseModalError }  style = {{ cursor: 'pointer', margin: '10px' }}></i>
          <p><span>Error.</span> Your message was not sent. Please check your connection or firewall settings.</p>
        </Modal>
        <form onSubmit = {this.onSubmitHandler}>
          <p>
            <label>Your name:
              <input id = 'name' type = 'text' name='name' value = { this.state.name } onChange = { this.onChangeHandler } required/>
            </label>
          </p>
          <p>
            <label>Your email:
              <input id = 'email' type = 'email' name='email' value = { this.state.email } onChange = { this.onChangeHandler } required/>
            </label>
          </p>
          <p>
            <label>Message:
              <textarea id = 'message' type = 'text' name = 'message' value = { this.state.message } onChange = { this.onChangeHandler } required/>
            </label>
          </p>
          <div>
            <button type='submit' name='send' disabled = { this.state.disabled }>Send</button>
          </div>
        </form>
        <div className = 'grid'>
          {history}
        </div>
      </Wrapper>
    )
  }
}
