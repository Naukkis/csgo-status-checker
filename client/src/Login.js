import React, { Component } from 'react';
import { Button, Col, Form, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import axios from 'axios';

class Login extends Component {
	constructor(props){
	    super(props);
	    this.state = {username: '', password: ''};
	    this.onSubmit = this.onSubmit.bind(this);
	    this.handleChange = this.handleChange.bind(this);
	}

	onSubmit(e) {
	    e.preventDefault();

	    axios.post('/login',{
	      username: this.state.username,
	      password: this.state.password }
	      )
	    .then((res) => {
	      this.props.closeModal();
	      localStorage.setItem('token', res.data.token);
	      localStorage.setItem('username', res.data.username);
	      localStorage.setItem('userID', res.data.userid);
	    })
	    .catch(function (err) {
	      alert('User name or password is wrong');
	    })
	}

	handleChange(e) {
    	this.setState({[e.target.id]: e.target.value});
  	}

  	render() {
	    return (
	    	<Form horizontal onSubmit={this.onSubmit}>
	    		<FormGroup controlId='username'>
	    		<Col componentClass={ControlLabel} sm={2}>
					Username:
				</Col>
				<Col sm={10}>
	    		<FormControl
	    			type='text'
	    			value={this.state.username}
	    			placeholder='Username'
	    			onChange={this.handleChange} 
	    		/>
	    		</Col>
	    		</FormGroup>
	    		<FormGroup controlId='password'>
	    		<Col componentClass={ControlLabel} sm={2}>
					Password:
				</Col>
				<Col sm={10}>
	    		<FormControl
	    			type='password'
	    			placeholder='Password'
	    			value={this.state.password}
	    			onChange={this.handleChange} 
	    		/>
	    		</Col>
	    		</FormGroup>
	    		<FormGroup>
	    			<Col smOffset={10} sm={2}>
	    			<Button type='submit'>Login</Button>
	    			</Col>
	    		</FormGroup>
	    	</Form>
	    );
	}
  }

  export default Login; 
