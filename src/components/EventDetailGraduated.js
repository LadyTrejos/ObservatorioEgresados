import React from 'react';
import {
    Form,
    Descriptions,
    Tag,
    Skeleton,
    Row,
    Button,
    Col,
    Modal,
    message
  } from 'antd';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import * as actions from '../store/actions/auth';

import history from '../helpers/history';
import HOSTNAME from '../helpers/hostname';
import PostList from './PostList';

const confirm = Modal.confirm;

class EventDetailGraduatedView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        eventInfo: {
            name:'',
            description:'',
            place:'',
            date:'',
            hour:'',
            organizer:'',
            admin: '',
            interests: [],
            url: null
        },
    };
  }
  
  componentWillMount(){
    const graduatedID = localStorage.getItem('user');
    axios.get(`${HOSTNAME}/api/egresados/${graduatedID}/`)
    .then(res => {
        this.setState({
        events:res.data.events
        })
    })
    const eventID = this.props.match.params.id;
    axios.get(`${HOSTNAME}/api/eventos/${eventID}/`)
    .then(res => {
      this.setState({ 
        eventInfo: {
            name: res.data.name,
            description:res.data.description,
            place:res.data.place,
            date:res.data.date,
            hour:res.data.hour,
            organizer:res.data.organizer,
            admin: res.data.admin,
            interests: res.data.interests,
            url: res.data.url,
            id: res.data.id
        },

      })
    })
    axios.get(`${HOSTNAME}/api/intereses/`)
      .then(res => {
        let interests = {}
        res.data.map( item => 
          interests[item.id] = item.name
        )
        this.setState({ interests: interests })
      })
    }


  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  showConfirm(id) {

    confirm({
      title: '¿Está seguro(a) que desea eliminar este evento?',
      content: 'Si elimina el evento ni usted ni los egresados suscritos a este podrán verlo de nuevo.',
      onOk: () => {
        axios.delete(`${HOSTNAME}/api/eventos/${id}/`)
        .then(() => 
          history.push('/eventos')
        )
      },
      onCancel() {},
    });
  }

  ToSuscribe = () => {
      const id = this.state.eventInfo.id;
    if(!this.state.events.includes(id)){
      this.state.events.push(id)
      this.setState({suscrito: !this.state.suscrito})
      message.success('Acabas de suscribirte al evento.')
    }else{
      for( var i = 0; i < this.state.events.length; i++){ 
        if ( this.state.events[i] === id) {
          this.state.events.splice(i, 1); 
        }
     }
     this.setState({suscrito: !this.state.suscrito})
     message.info('Haz eliminado la suscripción al evento.')
    }
    const graduatedID = localStorage.getItem('user')
    const EventData = JSON.stringify({events:this.state.events});
    console.log(EventData)
    axios.patch(`${HOSTNAME}/api/egresados/${graduatedID}/`,
        EventData,
        { headers: {"Content-type": "application/json"}}
    )
    .catch(err => 
      console.log(err)
    )
    
  
    }

  render() {
    return (
        <div style={{backgroundColor:'white', padding:15}}>
            {
                this.state.eventInfo && this.state.interests ? 
                <div>
                    <div
                        style={{display:"flex", justifyContent:"center", alignItems:"center", marginTop:"5%"}}>
                        
                        <br/>
                        <img
                            style={{maxHeight:"30vh", maxWidth:"30vw"}}
                            alt="Foto del evento"
                            src={this.state.eventInfo.url}
                        />
                    </div>        
                    <Descriptions
                        title={<span style={{display:"flex", justifyContent:"center", alignItems:"center",fontSize:20, color:'#001870'}}>{this.state.eventInfo.name}</span>}
                        column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
                    >
                            
                        <Descriptions.Item label="Descripción">{this.state.eventInfo.description}</Descriptions.Item>
                        <Descriptions.Item label="Intereses">{ this.state.eventInfo.interests.map( item => (
                                <Tag key={item}>{this.state.interests[item]}</Tag>
                                ))
                                }</Descriptions.Item>
                        <Descriptions.Item label="Lugar">{this.state.eventInfo.place}</Descriptions.Item>
                        <Descriptions.Item label="Fecha">{this.state.eventInfo.date}</Descriptions.Item>
                        <Descriptions.Item label="Hora">{this.state.eventInfo.hour}</Descriptions.Item>
                        <Descriptions.Item label="Organizador">{this.state.eventInfo.organizer}</Descriptions.Item>
                    </Descriptions>
                    <Row type="flex" justify="center" align="middle" gutter={20}>
                        <Col>
                            <Button size='large' 
                                style={{width:'100%', borderRadius:'10%', color:'#fff', backgroundColor:'#FF5126', borderColor:'FF5126'}}
                                onClick={()=>this.ToSuscribe()}
                            >
                                 {this.state.events.includes(this.state.eventInfo.id) ? "Eliminar suscripción" : "Suscribirse"}
                            </Button>
                        </Col>
                    </Row>
                    <br/>
                    <span style={{fontSize:20, color:'#001870'}}>Publicaciones</span>
                    <PostList {...this.props} admin={false}/>
                    </div>
                :
                <Skeleton/>
            }
    </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: state.loading,
    error: state.error
  }
}

const EventDetailGraduated = Form.create({ name: 'EventDetailGraduated' })(EventDetailGraduatedView);
const mapDispatchToProps = dispatch => {
    return {
      logout: () => dispatch(actions.logout())
    }
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EventDetailGraduated));