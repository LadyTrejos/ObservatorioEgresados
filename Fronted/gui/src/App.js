import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'antd/dist/antd.css';
//import * as actions from './store/actions/auth';


import LoginForm from'./components/LoginForm';
import CustomLayout from './containers/Layout'
import { Layout } from 'antd';
  
class App extends Component {
 
  
  render() {  
    return (
      <div>
        <CustomLayout/>
      </div>
    );
  }
}



export default App;
