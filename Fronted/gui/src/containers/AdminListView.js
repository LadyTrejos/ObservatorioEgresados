import React from 'react';
import axios from 'axios'

import AdminList from '../components/AdminList'

  class AdminListView extends React.Component {
   state={
       admins: []
   }

   componentDidMount(){
       axios.get('http://127.0.0.1:8000/api/admin-list')
       .then(res =>{
           this.setState({
               admins: res.data
           })
       })
   }

   render(){
       return(
           <div>
               <AdminList data={this.state.admins}/>
           </div>
       )
   }

  }





  export default AdminListView;
