import React from 'react';
import { NavItem, Nav, Navbar, NavDropdown, MenuItem, Modal } from 'react-bootstrap';
import Login from './Login';

class NavigationBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {showLogin: false};
		this.handleLogin = this.handleLogin.bind(this);
		this.closeLogin = this.closeLogin.bind(this);
	}

	handleLogin() {
		this.setState({showLogin: true});
	}

	closeLogin() {
		this.setState({showLogin: false});
	}

	render() {
		return (
			<Navbar inverse collapseOnSelect>
			    <Navbar.Header>
			      <Navbar.Brand>
			        <a href="#">CS:GO Status Checker</a>
			      </Navbar.Brand>
			      <Navbar.Toggle />
			    </Navbar.Header>
			    <Navbar.Collapse>
			      <Nav>
			        <NavItem eventKey={1} href="#">Link</NavItem>
			        <NavItem eventKey={2} href="#">Link</NavItem>    
			      </Nav>
			      <Nav pullRight>
				      <NavItem eventKey={1} onClick={this.handleLogin}>Login</NavItem>
				      <NavDropdown eventKey={3} title="Account" id="basic-nav-dropdown">
				          <MenuItem eventKey={3.1}>Action</MenuItem>
				          <MenuItem eventKey={3.2}>Another action</MenuItem>
				          <MenuItem eventKey={3.3}>Something else here</MenuItem>
				          <MenuItem divider />
				          <MenuItem eventKey={3.3}>Separated link</MenuItem>
			          </NavDropdown>			       
			      </Nav>
			    </Navbar.Collapse>
			  
			<Modal
				show={this.state.showLogin}
				onHide={this.closeLogin}
			>
			<Modal.Header closeButton>
				<Modal.Title>Login</Modal.Title>
			</Modal.Header>
			<Login closeModal={this.closeLogin}/>
			</Modal>
			</Navbar>
		)
	}
}

export default NavigationBar;