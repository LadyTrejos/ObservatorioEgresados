import React from "react";
import "antd/dist/antd.css";
import { List, Avatar, Icon, Form, Button, message, Row, Empty } from "antd";
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import HOSTNAME from '../helpers/hostname';

const colorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae','#f56a50', '#72f5e6', '#f9bf00', '#0092ae','#f53a00', '#726566'];

const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);



class Egresadoslist extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      visible: false,
      requests: [],
      myRequests: [],
      myFriends: []
    }
  }

  componentWillMount = () => {
    const user = localStorage.getItem('user');
    // Traer mi lista de amigos
    axios.get(`${HOSTNAME}/api/egresados/${user}/`)
    .then(res => this.setState({myFriends: res.data.friends}))

    // Cargar las solicitudes de amistad para mí 
    axios.get(`${HOSTNAME}/api/friend-requests/?to_user=&from_user=${user}`)
    .then( (res) => {
      let myRequests = res.data.map( item => item.to_user)
      this.setState({
        requests: res.data,
        myRequests
      })
    })
  }

    handleOk = e => {
        console.log(e);
        this.setState({
          visible: false,
        });
      };

      handleCancel = e => {
        console.log(e);
        this.setState({
          visible: false,
        });
      };

    addFriend = (friend) => {
      const user = localStorage.getItem('user');
      const newData = JSON.stringify({'from_user': user, 'to_user': friend.id})
      axios.post(`${HOSTNAME}/api/friend-requests/`,
                    newData,
                    { headers: {"Content-Type": "application/json"}})
        .then((res) => {
          message.success(`La solicitud de amistad ha sido enviada.`)
          let requests = [...this.state.requests]
          let myRequests = [...this.state.myRequests]
          requests.push(res.data)
          myRequests.push(friend.id)
          this.setState({
            requests,
            myRequests
          })
        })
        .catch(err => {
          console.log(err.message)
        })
    }

    cancelFriendRequest = (friend) => {
      const index = this.state.myRequests.indexOf(friend.id)
      const id = this.state.requests[index].id
      axios.delete(`${HOSTNAME}/api/friend-requests/${id}/`)
      .then( () => {
        message.info('La solicitud de amistad ha sido cancelada.')
        let requests = [...this.state.requests]
        let myRequests = [...this.state.myRequests]
        requests.splice(index, 1)
        myRequests.splice(index, 1)
        this.setState({
          requests,
          myRequests
        })
      })
    }

    removeFriend = (friend) => {
      const currentUser = localStorage.getItem('user')
      let myFriends = [...this.state.myFriends]
      const index = myFriends.indexOf(friend.id)
      myFriends.splice(index, 1)

      const userData = JSON.stringify({'friends': myFriends})
      axios.patch(`${HOSTNAME}/api/egresados/${currentUser}/`, 
        userData,
        { headers: {"Content-Type": "application/json"}}
      )
      .then(() => {
        this.props.loadData()
        message.info(`Has eliminado a ${friend.name} de tus amigos.`)
        this.setState({
          myFriends
        })
      })
    }

    handleFriendRequest = (friend) => {
      if(this.state.myRequests.includes(friend.id)){
        this.cancelFriendRequest(friend)
      } else if (this.state.myFriends.includes(friend.id)){
        this.removeFriend(friend)
      } else {
        this.addFriend(friend)
      }
    }

    buttonText = (item) => {
      if(this.state.myRequests.includes(item.id)){
        return 'Cancelar solicitud de amistad'
      } else if (this.state.myFriends.includes(item.id)){
        return 'Eliminar de mis amigos'
      } else {
        return 'Agregar a mis amigos'
      }
    }

    render(){
      const currentUser = localStorage.getItem('user');
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
                        item.id !== currentUser ? 
                        <List.Item style={{backgroundColor:'#fff', paddingLeft: 20}}
                            actions={[
                              <Button onClick={() => this.handleFriendRequest(item)}>
                                { this.buttonText(item)}
                              </Button>
                            ]}>


                            <List.Item.Meta
                                avatar={
                                    <Avatar  style={{backgroundColor: colorList[Math.floor(Math.random() * 10)], verticalAlign: 'middle' }} size='large'>
                                        { item.name[0].toUpperCase()}
                                    </Avatar>
                                }
                                title={item.name + ' ' + item.last_name}
                                description={
                                    <div>
                                    <IconText type="environment" text={`Lugar de residencia: ${item.city} ${item.region}, ${item.country}`}/>
                                    <br/>
                                    <IconText type="mail" text={`Correo: ${item.email}`}/>
                                    <br/>
                                    </div>
                                }
                            />
                        </List.Item>
                        :
                        <div></div>
                    )}
                />
                :
              <Row type="flex" justify="center" align="middle">
                <Empty description={<span style={{fontSize:20, color:'#001870'}}>No se han registrado más egresados.</span>}/>
              </Row>
              }
            </div> 
        );
    }
    }

   const EgresadosList1 = Form.create({ name: 'EgresadosList' })(Egresadoslist);

    export default withRouter(EgresadosList1);
