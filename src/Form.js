import axios from 'axios';
import fire from './Firebase';
import Modal from 'react-modal';
import React, { Component } from 'react';
import reset from 'modern-css-reset';
// import Spinner from 'react-spinkit';
import styled from 'styled-components';

import './Form.css';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  text-align: justify;
  & form {
    position: relative;
    display: block;
    width: 40%;
    margin: auto 0;
    top: 0; right: 0; bottom: 0; left: 0;
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
  & div {
    display: flex;
    align-items: center;
  }
`;

export default class Form extends Component {
  constructor( props ) {
    super( props );
    this.state = {
        name: '',
        email: '',
        message: '',
        showModalSuccess: false,
        showModalError: false,
        // display: 'none'
    };
    this.onSubmitHandler = this.onSubmitHandler.bind( this );
    this.onChangeHandler = this.onChangeHandler.bind( this );
    this.resetForm = this.resetForm.bind(this);
    this.handleCloseModalSuccess = this.handleCloseModalSuccess.bind( this );
    this.handleCloseModalError = this.handleCloseModalError.bind( this );
    // this.spinnerHandler = this.spinnerHandler.bind( this );
  }

  onChangeHandler = ( event ) => {
    // event.preventDefault();
    let name = event.target.name;
    let value = event.target.value;
    this.setState({
        [name]: value /* The ES6 computed property name syntax is used to update the state key corresponding to the given input name:*/
    });
  }

  onSubmitHandler = ( event ) => {
    event.preventDefault();

    const name = this.state.name;
    const email = this.state.email;
    const message = this.state.message;
    console.log( name, email, message );
    const formObj = {
        name: name,
        email: email,
        message: message
    };
    const axiosConfig = {
      headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          "Access-Control-Allow-Origin": "*"
      }
    };

    axios
    .post( 'https://us-central1-react-feedback-form.cloudfunctions.net/app', formObj, axiosConfig )
    .then( ( res ) => {
        console.log( res )
        if ( res.data.msg === 'success' ) {
            this.resetForm();
            this.setState({ display: 'none', showModalSuccess: true });
        } else if ( res.data.msg === 'fail' ) {
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
    this.setState({ showModalSuccess: false })
  }

  handleCloseModalError = () => {
    this.setState({ showModalError: false })
  }

  // spinnerHandler = () => {
  //   this.setState({ display: 'block' })
  // }

  render() {

    return(
      <Wrapper>
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
          <i className='fas fa-times' onClick = { this.handleCloseModalError }  style = {{ cursor: 'pointer', margin: '10px' }}></i>
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
            <button type='submit' name='send' onClick = { this.spinnerHandler }>Send</button>
          </div>
          {/*<Spinner name='three-bounce' style = {{ display: this.state.display, marginLeft: '1em' }} />*/}
        </form>
      </Wrapper>
    )
  }
}
