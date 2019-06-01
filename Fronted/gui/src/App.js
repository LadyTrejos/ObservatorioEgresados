import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { connect } from 'react-redux';
import BaseRouter from './routes';
import 'antd/dist/antd.css';

import * as actions from './store/actions/auth';

import LoginForm from'./components/LoginForm';
  
class App extends Component {
  componentDidMount() {
    this.props.onTryAutoSignup()
  }
  
  render() {  
    return (
      <div>
        <Router>
          <LoginForm {...this.props}>
            <BaseRouter/>
          </LoginForm>
        </Router>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.token !== null
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);