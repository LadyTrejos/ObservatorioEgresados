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



class FriendCircle extends React.Component {
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
  }

    removeFriend = (friend) => {
      const currentUser = localStorage.getItem('user')
      let myFriends = [...this.state.myFriends]
      const index = myFriends.indexOf(friend.user.id)
      myFriends.splice(index, 1)

      const userData = JSON.stringify({'friends': myFriends})
      axios.patch(`${HOSTNAME}/api/egresados/${currentUser}/`, 
        userData,
        { headers: {"Content-Type": "application/json"}}
      )
      .then(() => {
        this.props.loadData()
        message.info(`Has eliminado a ${friend.user.name} de tus amigos.`)
        this.setState({
          myFriends
        })
      })
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
                              <Button onClick={() => this.removeFriend(item)}>
                                Eliminar de mis amigos
                              </Button>
                            ]}>


                            <List.Item.Meta
                                avatar={
                                    <Avatar  style={{backgroundColor: colorList[Math.floor(Math.random() * 10)], verticalAlign: 'middle' }} size='large'>
                                        { item.user.name[0].toUpperCase()}
                                    </Avatar>
                                }
                                title={item.user.name + ' ' + item.user.last_name}
                                description={
                                    <div>
                                    <IconText type="environment" text={`Lugar de residencia: ${item.user.city} ${item.user.region}, ${item.user.country}`}/>
                                    <br/>
                                    <IconText type="mail" text={`Correo: ${item.user.email}`}/>
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
                <Empty description={<span style={{fontSize:20, color:'#001870'}}>Aún no has agregado egresados a tu círculo de amigos.</span>}/>
              </Row>
              }
            </div> 
        );
    }
    }

   const FriendCircleList = Form.create({ name: 'FriendCircleList' })(FriendCircle);

    export default withRouter(FriendCircleList);
