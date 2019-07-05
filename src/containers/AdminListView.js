import React from 'react';
import axios from 'axios';

import AdminList from '../components/AdminList'
import HOSTNAME from '../helpers/hostname';

  class AdminListView extends React.Component {
   state={
       admins: []
   }

   componentDidMount(){
       this.loadData()
   }

   loadData = () => {
    axios.get(`${HOSTNAME}/api/admin-list/`)
    .then(res =>{
        this.setState({
            admins: res.data
        })
    })
   }

   render(){
       return(
           <div>
               <AdminList data={this.state.admins} loadData={this.loadData}/>
           </div>
       )
   }

  }
  
  
  export default AdminListView;