
import React from 'react';
import 'antd/dist/antd.css';
import axios from 'axios'
import { Card, Icon, Tag, Divider, Row, Col, Button, Modal, List } from 'antd';

const { Meta } = Card;
const confirm = Modal.confirm;


const IconText = ({ type, text }) => (
    <span>
      <Icon type={type} style={{ marginRight: 8 }} />
      {text}
    </span>
  );

class ViewEvent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            events: [{
              title:'Fiesta de integración de egresados',
              description:'Cada año, en la redacción de Gatopardo nos preocupamos por llevarle a nuestros lectores las historias más interesantes',
              tags: 'tag',
              date:'date',
              time:'time',
              place:'place',
              photo:'https://cdn.pixabay.com/photo/2015/04/04/21/41/concert-707155_960_720.jpg'
              },],
            
        }
        this.countryRef = React.createRef();
    }

      showModal = () => {
        this.setState({
          visible: true,
        });
      };

      handleOk = (e, id) => {
        console.log(id)
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

      showConfirm = (item) => {
        console.log(item)
        confirm({
          title: '¿Está seguro(a) que desea eliminar este evento?',
          content: 'Si elimina el evento ni usted ni los egresados suscritos a este podrán verlo de nuevo.',
          onOk() {
            return new Promise((resolve, reject) => {
              setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
            }).catch(() => console.log('Oops errors!'));
          },
          onCancel() {},
        });
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
                pageSize: 2
              }}
              dataSource={this.props.data}
            
              renderItem={item => (
                  <Card
                    style={{width:'30vw', minWidth:400, borderColor:'gray', borderRadius:20}}
                    cover={
                      <div 
                        style={{display:"flex", justifyContent:"center", alignItems:"center", marginTop:"5%" }}>
                        <img
                            style={{width: '90%', height: '90%'}}
                            alt="Foto del evento"
                            src={this.state.events[0].photo}
                        />
                      </div>    
                    }
                  >
                    <Meta
                      style={{textAlign:'center'}}
                      title= {item.name}
                    />
                    <br/>
                    <Meta
                      style={{color:'#2F3E9E'}}
                      description={item.description}
                    />
                    <br/>
                    <br/>
                    
                    <Tag>{item.interests[0]}</Tag>
                    <Divider/>
                    <IconText type="calendar" text={item.date}/>
                    <br/>
                    <IconText type="clock-circle" text={item.hour}/>
                    <br/>
                    <IconText type="environment" text={item.place}/>
                    <br/>
                    <br/>
                    <Row type='flex' justify='center' align='middle' >
                        <Col>
                            <Button size='large' style={{width:'100%', borderRadius:'10%', color:'#fff', backgroundColor:'#FF5126', borderColor:'FF5126'}}>
                              Editar
                            </Button>
                        </Col>
                        <Col>
                            <Button onClick={()=>this.showConfirm(item)} size='large' style={{width:'100%', borderRadius:'10%', color:'#fff', backgroundColor:'#8F9AE0', borderColor:'#8F9AE0'}}>
                              Eliminar
                            </Button>
                        </Col>
                    </Row>
                </Card>
            )}
          />
        )
    }
}

export default ViewEvent
         