import React from 'react';
import axios from 'axios';
import { Row, Button, Input } from 'antd';
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
           <div style={{alignItems:'center', justifyContent:'center', display:'center'}}>
               <h2 style={{paddingLeft:'40%'}}><strong>Eventos</strong></h2>
                <Row guter={50}>
                    <Input placeholder='Buscar'></Input>
                    <Button style={{backgroundColor:'#FF5126'}}>Buscar</Button>
                    <Button
                        style={{backgroundColor:'#22BA45', }}
                        href='/crear-evento'
                    >
                        Crear eventos
                    </Button>
                </Row>
                <br/><br/>
                <ViewEvent data={this.state.events}/>
                <br/>
           </div>
       )
   }

  }
  
  
  
  
  
  export default AdminListView;