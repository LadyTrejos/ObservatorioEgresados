import React from 'react';
import axios from 'axios';

import EgresadosList from '../components/EgresadosList'
import HOSTNAME from '../helpers/hostname';

  class EgresadoListView extends React.Component {
   state={
       egresados: []
   }

   componentDidMount(){
       this.loadData()
   }

   loadData = () => {
    axios.get(`${HOSTNAME}/api/egresado-list/`)
    .then(res =>{
        this.setState({
            egresados: res.data
        })
    })
   }

   render(){
       return(
           <div>
               < EgresadosList data={this.state.egresados} loadData={this.loadData}/>
           </div>
       )
   }

  }





  export default EgresadoListView;
