import React from 'react';
import axios from 'axios';
import { Row, Input } from 'antd';
import ViewEvent from '../components/ViewEvent1'
import HOSTNAME from '../helpers/hostname';

const Search = Input.Search;

class EgresadoListView1 extends React.Component {
state={
    events: []
}

componentDidMount(){
    this.loadData()
}

loadData = () => {
    axios.get(`${HOSTNAME}/api/eventos/?ordering=-created_at`)
    .then(res =>{
        this.setState({
            events: res.data
        })
    })
}

handleSearch = (value) => {
    axios.get(`${HOSTNAME}/api/eventos/?search=${value}&&ordering=-created_at`)
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





export default EgresadoListView1;
