import React from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import { List, Avatar, Icon, Descriptions, Form, Divider,Row, Col,Button, Modal } from "antd";


import { withRouter, Link } from 'react-router-dom';
const colorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae','#f56a50', '#72f5e6', '#f9bf00', '#0092ae','#f53a00', '#726566'];
const nameList =['jorge', 'ivan', 'lady', 'johanna', 'daniel', 'carmen', 'lina', 'nico', 'yami', 'fanny']

const listData = [];
for (let i = 0; i < 23; i++) {
  listData.push({
    id: `${i}`,
    name: `Iván ${i}`,
    genero:'masculino',
    correo: 'ivan@gmail.com',
});
}

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

    render(){
        console.log(colorList[Math.floor(Math.random() * 10)])
        return(
                <List
                    itemLayout="vertical"
                    size="large"
                    pagination={{
                    onChange: page => {
                        console.log(page);
                    },
                    pageSize: 3
                    }}
                    dataSource={listData}
                    
                    
                    renderItem={item => (
                        <Row gutter={10}>
                            <Col span={2}>
                                <Avatar  style={{backgroundColor: colorList[Math.floor(Math.random() * 10)], verticalAlign: 'middle' }} size='large'>
                                    { nameList[Math.floor(Math.random() * 10)][0]}
                                </Avatar>
                                
                            </Col>
                            <Col span={5}>
                                <Descriptions
                                    title={item.name}
                                    column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
                                >
                                    
                                    <Descriptions.Item icon='idcard' label="Id" span={5}>{item.id}</Descriptions.Item>
                                    <Descriptions.Item label="correo" span={5}>{item.correo}</Descriptions.Item>
                                    <Descriptions.Item label="genero" span={5}>{item.genero}</Descriptions.Item>
                                    
                                </Descriptions>
                            </Col>
                            
                            <Button>
                                <Link to='/modificar-admin'>Editar</Link>
                            </Button>
                            
                            <Button onClick={this.showModal} size='large' type="primary" htmlType="submit" style={{backgroundColor:'#8F9AE0', borderColor:'#8F9AE0'}}>
                                Desactivar cuenta
                            </Button>
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

                            <Divider/>

                    </Row>
                    )}
                />
        );
    }
    }

    const AdminList = Form.create({ name: 'AdminList' })(Adminlist);
  
  
  
    export default withRouter(AdminList);