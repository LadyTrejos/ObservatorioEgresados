import React from 'react';
import axios from 'axios';

import EgresadosList from '../components/EgresadosList'

  class EgresadoListView extends React.Component {
   state={
       egresados: []
   }

   componentDidMount(){
       this.loadData()
   }

   loadData = () => {
    axios.get('http://127.0.0.1:8000/api/egresado-list')
    .then(res =>{
        this.setState({
            egresados: res.data
        })
    })
   }

   render(){
       return(
           <div>
               < Egresadoslist data={this.state.egresados} loadData={this.loadData}/>
           </div>
       )
   }

  }





  export default EgresadoListView;
