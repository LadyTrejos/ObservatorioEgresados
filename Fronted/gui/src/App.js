import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'antd/dist/antd.css';
//import * as actions from './store/actions/auth';


import LoginForm from'./components/LoginForm';
  
class App extends Component {
 
  
  render() {  
    return (
      <div>
        <LoginForm />
      </div>
    );
  }
}



export default App;
