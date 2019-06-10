import React from 'react';
import axios from 'axios';
import { Row, Button } from 'antd';
import ViewEvent from '../components/ViewEvent'

  class AdminListView extends React.Component {
   state={
       events: []
   }

   componentDidMount(){
       this.loadData()
   }

   loadData = () => {
    axios.get('http://localhost:8000/api/eventos/?ordering=-created_at')
    .then(res =>{
        this.setState({
            events: res.data
        })
    })
   }

   render(){
       return(
           <div>
               <h2>Eventos</h2>
                <Row>
                <Button>Buscar</Button>
                <Button
                    style={{backgroundColor:'#22BA45'}}
                    href='/crear-evento'
                >
                    Crear eventos
                </Button>
                </Row>
                <ViewEvent data={this.state.events} loadData={this.loadData}/>
           </div>
       )
   }

  }
  
  
  
  
  
  export default AdminListView;