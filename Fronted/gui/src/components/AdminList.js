import React from "react";
import "antd/dist/antd.css";
import { List, Avatar, Icon, Skeleton, Form, Button, Modal } from "antd";
import { withRouter, Link } from 'react-router-dom';
import axios from "axios";

const colorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae','#f56a50', '#72f5e6', '#f9bf00', '#0092ae','#f53a00', '#726566'];


const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);



class Adminlist extends React.Component {
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
      };

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
  
      showModal = () => {
        this.setState({
          visible: true,
        });
      };

      handleEdit = (adminID) => {
        axios.get(`http://127.0.0.1:8000/api/users/${adminID}/`)
        .then(res => {
          
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
                        <List.Item 
                            actions={[
                                <Button 
                                  size='large' 
                                  style={{backgroundColor:'#FF5126', borderColor:'#FF5126', borderRadius:10}}
                                  href={`editar-admin/${item.id}`}
                                >
                                  Editar
                                </Button>, 
                                <Button onClick={this.showModal} size='large' type="primary" style={{backgroundColor:'#8F9AE0', borderColor:'#8F9AE0', borderRadius:10}}>
                                Desactivar cuenta
                                </Button>
                            ]}>
                            <Skeleton avatar title={true} loading={item.loading} active>
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
                            
                                
                            
                            </Skeleton>
                            <Modal
                                title="Confirmación"
                                visible={this.state.visible}
                                onOk={this.handleOk}
                                onCancel={this.handleCancel}
                                footer={[
                                <Button key="back" onClick={this.handleCancel}>
                                    Cancelar
                                </Button>,
                                <Button key="submit" htmlType="submit" type="primary" onClick={this.handleOk}>
                                    <Link to='/'>Desactivar</Link>
                                </Button>,
                                ]}
                            >
                                <p>¿Está seguro que desea desactivar la cuenta?</p>
                            </Modal>

                        </List.Item>
                        
                    )}
                />
        );
    }
    }

    const AdminList = Form.create({ name: 'AdminList' })(Adminlist);
  
  
  
    export default withRouter(AdminList);