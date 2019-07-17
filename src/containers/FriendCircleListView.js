import React from 'react';
import axios from 'axios';

import FriendCircleList from '../components/FriendCircleList'
import HOSTNAME from '../helpers/hostname';

  class FriendCircleListView extends React.Component {
   state={
       friends: []
   }

   componentDidMount(){
       this.loadData()
   }

   loadData = () => {
    const currentUser = localStorage.getItem('user')
    axios.get(`${HOSTNAME}/api/friend-circle/?user=${currentUser}`)
    .then(res =>{
        this.setState({
            friends: res.data[0].friends
        })
    })
   }

   render(){
       return(
           <div>
               <FriendCircleList data={this.state.friends} loadData={this.loadData}/>
           </div>
       )
   }
  }

  export default FriendCircleListView;
