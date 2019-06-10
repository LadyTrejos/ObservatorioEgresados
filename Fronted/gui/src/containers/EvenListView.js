import React from 'react';
import axios from 'axios';
import { Row, Button, Input, Col } from 'antd';
import ViewEvent from '../components/ViewEvent'

const Search = Input.Search;

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

handleSearch = (value) => {
    axios.get(`http://localhost:8000/api/eventos/?search=${value}&&ordering=-created_at`)
    .then(res =>{
        this.setState({
            events: res.data
        })
    })
}

render(){
    return(
        <div>
            <Row type="flex" justify="center" align="middle">
                <h2 style={{fontSize:30, color:'#001870'}}>Eventos</h2>
            </Row>
            <Row gutter={200}>
                <Col sm={8} md={8} lg={10}>
                    <Search 
                        placeholder="Buscar evento"
                        onSearch={value => this.handleSearch(value)} 
                        enterButton 
                    />
                </Col>
                <Col>
                    <Button
                        style={{backgroundColor:'#22BA45'}}
                        href='/crear-evento'
                    >
                        Crear eventos
                    </Button>
                </Col>
            </Row>
            <br/>
            <br/>
            <ViewEvent data={this.state.events} loadData={this.loadData}/>
        </div>
    )
}

}





export default AdminListView;