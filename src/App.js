import React, { Component } from 'react';
import { Router } from 'react-router-dom';
import { connect } from 'react-redux';
import BaseRouter from './routes';
import 'antd/dist/antd.css';
import history from './helpers/history';

import * as actions from './store/actions/auth';
  
class App extends Component {
  componentDidMount() {
    this.props.onTryAutoSignup()
    
  }
  
  render() {  
    return (
      <div>
        <Router history={history}>
            <BaseRouter {...this.props}/>
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