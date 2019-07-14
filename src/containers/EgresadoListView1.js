import React from 'react';
import axios from 'axios';
import { Row, Input } from 'antd';
import EgresadosList from '../components/EgresadosList1'
import HOSTNAME from '../helpers/hostname';
const Search = Input.Search;


  class EgresadoListView1 extends React.Component {
   state={
       egresados: []
   }

   componentDidMount(){
       this.loadData()
   }

   loadData = () => {
    axios.get(`${HOSTNAME}/api/egresado-list/?is_active=True&&ordering=-is_graduated`)
    .then(res =>{
        this.setState({
            egresados: res.data
        })
    })
   }
   handleSearch = (value) => {
       axios.get(`${HOSTNAME}/api/egresado-list/?search=${value}&&ordering=-id`)
       .then(res =>{
           this.setState({
               egresados : res.data
           })
       })
   }




   render(){
       return(
         <div>
             <Row type="flex" justify="center" align="middle">
                 <h2 style={{fontSize:30, color:'#001870'}}>Egresados</h2>
             </Row>
             <Row >
                 <div style={{display:'flex', flexDirection:'row', justifyContent:'flex-end'}}>

                 </div>
                 <Search
                     placeholder="Buscar egresado"
                     onSearch={value => this.handleSearch(value)}
                     enterButton
                     size='large'
                     style={{maxWidth: 300}}
                 />
             </Row>

             <br/>
             < EgresadosList data={this.state.egresados} loadData={this.loadData}/>

         </div>
       )
   }

  }





  export default EgresadoListView1;
