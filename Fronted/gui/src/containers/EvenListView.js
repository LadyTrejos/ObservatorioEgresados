import React from 'react';
import axios from 'axios';

import ViewEvent from '../components/ViewEvent'

  class AdminListView extends React.Component {
   state={
       events: []
   }

   componentDidMount(){
       axios.get('http://127.0.0.1:8000/api/eventos')
       .then(res =>{
           this.setState({
               events: res.data
           })
       })
   }

   render(){
       return(
           <div>
               <ViewEvent data={this.state.events}/>
           </div>
       )
   }

  }
  
  
  
  
  
  export default AdminListView;