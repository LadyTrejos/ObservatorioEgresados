import React from "react";
import "antd/dist/antd.css";
import { List, Avatar, Icon, Form, Button, Modal, message } from "antd";
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import history from '../helpers/history';

const colorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae','#f56a50', '#72f5e6', '#f9bf00', '#0092ae','#f53a00', '#726566'];

const confirm = Modal.confirm;

const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);



class Adminlist extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      visible: false
    }
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
  
      showConfirm(item) {
        
        confirm({
          title: `¿Está seguro(a) que desea ${ item.is_active ? "desactivar" : "activar" } esta cuenta?`,
          content: `${ item.is_active ? 
            "Al desactivar la cuenta, el administrador no podrá ingresar al sistema. " 
          : "Al activar la cuenta, el administrador podrá ingresar al sistema. " }`,
          onOk: () => {
            item.is_active = !item.is_active
            const userData = JSON.stringify(item)
            axios.put(`http://127.0.0.1:8000/api/users/${item.id}/`, 
                          userData, 
                          { headers: {"Content-Type": "application/json"}})
              .then(() => {
                let action = item.is_active ? "activado" : "desactivado"
                message.success(`El administrador ha sido ${action}.`)
                this.setState({
                  visible: false,
                })
                this.props.loadData()
              })
              .catch(err => {
                console.log(err.message)
              })
          },
          onCancel() {},
        });
      }

    handleDeactivate = (item) => {
      console.log(item)
      item.is_active = !item.is_active
      const userData = JSON.stringify(item)
      axios.put(`http://127.0.0.1:8000/api/users/${item.id}/`, 
                    userData, 
                    { headers: {"Content-Type": "application/json"}})
        .then(() => {
          let action = item.is_active ? "activado" : "desactivado"
          message.success(`El administrador ha sido ${action}.`)
          this.setState({
            visible: false,
          })
          this.props.loadData()
        })
        .catch(err => {
          console.log(err.message)
        })
        
    }

    render(){
        return(
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
                                  style={{backgroundColor:'#FF5126', borderColor:'#FF5126', borderRadius:10}}
                                  onClick={() => history.push(`editar-admin/${item.id}`)}
                                >
                                  Editar
                                </Button>, 
                                <Button onClick={() => {this.showConfirm(item)}} size='large' type="primary"  style={{backgroundColor:'#8F9AE0', borderColor:'#8F9AE0', borderRadius:'10%'}}>
                                  {item.is_active ? "Desactivar cuenta" : "Activar cuenta"}
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
                                    <IconText type="idcard" text={`Documento: ${item.id}`}/>
                                    <br/>
                                    <IconText type="mail" text={`Correo: ${item.email}`}/>
                                    <br/>
                                    </div>
                                }
                            />
                            
                            <Modal
                                title={`¿Está seguro(a) que desea ${ item.is_active ? "desactivar" : "activar" } esta cuenta?`}
                                visible={this.state.visible}
                                onOk={this.handleOk}
                                onCancel={this.handleCancel}
                                footer={[
                                  <Button key="back" onClick={(e) => this.handleCancel(e)}>
                                    Cancelar
                                  </Button>,
                                  <Button 
                                    key={item.id} 
                                    type="danger" 
                                    onClick={() => console.log(item)}
                                  >
                                    {item.is_active ? "Desactivar" : "Activar"}
                                  </Button>,
                                ]}
                            >
                                <p>
                                { item.is_active ? 
                                  "Al desactivar la cuenta, el administrador no podrá ingresar al sistema. " 
                                : "Al activar la cuenta, el administrador podrá ingresar al sistema. " }
                                </p>
                            </Modal>
                        </List.Item>

                        
                    )}
                />
        );
    }
    }

    const AdminList = Form.create({ name: 'AdminList' })(Adminlist);
  
  
  
    export default withRouter(AdminList);