import React from "react";
import "antd/dist/antd.css";
import { List, Avatar, Icon, Form, Button, Row, Empty, message } from "antd";
import { withRouter } from 'react-router-dom';
import axios from "axios";

import HOSTNAME from '../helpers/hostname';

const colorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae','#f56a50', '#72f5e6', '#f9bf00', '#0092ae','#f53a00', '#726566'];


const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);



class Friend_Request extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      egresadoInfo: {
        friends: []
      }
    }
  }

  componentWillMount = () => {
    // Load my friendlist
    const currentUser = localStorage.getItem('user');
    axios.get(`${HOSTNAME}/api/egresados/${currentUser}/`)
    .then(res => {
      this.setState({ egresadoInfo: {friends: res.data.friends}})
    })
  }
 
  acceptFriendRequest = (item) => {
    const currentUser = localStorage.getItem('user');

    let myFriendlist = [...this.state.egresadoInfo.friends]
    myFriendlist.push(item.from_user.id)
    const userData = JSON.stringify({'friends': myFriendlist})
    axios.patch(`${HOSTNAME}/api/egresados/${currentUser}/`, 
      userData,
      { headers: {"Content-Type": "application/json"}}
    )
    axios.delete(`${HOSTNAME}/api/friend-requests/${item.id}`)
    .then(() => {
      message.success('La solicitud de amistad ha sido aceptada.')
      this.setState({egresadoInfo:{friends: myFriendlist}}, () => this.props.loadData())
    })
  }


    render(){
        return(
          <div>
            {
              this.props.data.length > 0 ? 
                <List
                    itemLayout="horizontal"
                    size="middle"
                    pagination={{
                    onChange: page => {
                        console.log(page);
                    },
                    pageSize: 5
                    }}
                    dataSource={this.props.data}


                    renderItem={item => (
                        <List.Item style={{backgroundColor:'#fff', paddingLeft: 20}}
                            actions={[
                              <Button 
                                size='large'
                                style={{backgroundColor:'#28a745', borderColor:'#28a745', color:'white'}}
                                onClick={() => this.acceptFriendRequest(item)}
                                >
                                    Aceptar
                                </Button>,
                              <Button 
                                size='large'
                                style={{backgroundColor:'#dc3545', borderColor:'#dc3545', color:'white'}} 
                                onClick={() => this.declineFriendRequest(item)}
                                >
                                    Rechazar
                                </Button>
                            ]}>


                            <List.Item.Meta
                                avatar={
                                    <Avatar  style={{backgroundColor: colorList[Math.floor(Math.random() * 10)], verticalAlign: 'middle' }} size='large'>
                                        { item.from_user.name[0].toUpperCase()}
                                    </Avatar>
                                }
                                title={item.from_user.name + ' ' + item.from_user.last_name}
                                description={
                                    <div>
                                    <IconText type="environment" text={`Lugar de residencia: ${item.from_user.city} ${item.from_user.region}, ${item.from_user.country}`}/>
                                    <br/>
                                    <IconText type="mail" text={`Correo: ${item.from_user.email}`}/>
                                    <br/>
                                    </div>
                                }
                            />
                        </List.Item>
                    )}
                />
                :
              <Row type="flex" justify="center" align="middle">
                <Empty description={<span style={{fontSize:20, color:'#001870'}}>No tienes solicitudes de amistad.</span>}/>
              </Row>
              }
            </div> 
        );
    }
    }

   const FriendRequests = Form.create({ name: 'FriendRequest' })(Friend_Request);

    export default withRouter(FriendRequests);
