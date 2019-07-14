import React from 'react';
import axios from 'axios';

import FriendRequests from '../components/FriendRequests'
import HOSTNAME from '../helpers/hostname';
import { Row } from 'antd';

  class FriendRequestView extends React.Component {
   state={
       friend_requests: []
   }

   componentDidMount(){
       this.loadData()
   }

   loadData = () => {
    const currentUser = localStorage.getItem('user')
    axios.get(`${HOSTNAME}/api/friend-requests-list/?to_user=${currentUser}`)
    .then(res =>{
        this.setState({
            friend_requests: res.data
        })
    })
   }

   render(){
       return(
           <div>
               <Row type="flex" justify="center" align="middle">
                    <h2 style={{fontSize:30, color:'#001870'}}>Solicitudes de amistad</h2>
                </Row>
                <Row>
                    <FriendRequests data={this.state.friend_requests} loadData={this.loadData}/>
                </Row>
           </div>
       )
   }
  }

  export default FriendRequestView;
