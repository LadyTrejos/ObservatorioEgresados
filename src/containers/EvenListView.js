   import React from 'react';
import axios from 'axios';
import { Row, Button, Input } from 'antd';
import ViewEvent from '../components/ViewEvent'
import history from '../helpers/history';

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
            <Row >
                <div style={{display:'flex', flexDirection:'row', justifyContent:'flex-end'}}>
                    <Button
                        style={{backgroundColor:'#22BA45', color:'#ffff'}}
                        size='large'
                        onClick={() => history.push(`/crear-evento/`)}
                    >
                        Crear evento
                    </Button>
                </div>
                <Search
                    placeholder="Buscar evento"
                    onSearch={value => this.handleSearch(value)}
                    enterButton
                    size='large'
                    style={{maxWidth: 300}}
                />
            </Row>

            <br/>
            <ViewEvent data={this.state.events} loadData={this.loadData}/>
        </div>
    )
}

}





export default AdminListView;
