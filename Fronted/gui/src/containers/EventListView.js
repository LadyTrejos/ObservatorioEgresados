import React from 'react';
import axios from 'axios';

import EventList from '../components/EventList'

  class EventListView extends React.Component {
   state={
       eventos: []
   }

   componentDidMount(){
       axios.get('http://127.0.0.1:8000/api/eventlist')
       .then(res =>{
           this.setState({
               eventos: res.data
           })
       })
   }

   render(){
       return(
           <div>
               <EventList data={this.state.eventos}/>
           </div>
       )
   }

  }





  export default EventListView;
