
import React from 'react';
import 'antd/dist/antd.css';
import { Card, Icon, Tag, Divider, Row, Col, Button, Modal } from 'antd';

const { Meta } = Card;

const IconText = ({ type, text }) => (
    <span>
      <Icon type={type} style={{ marginRight: 8 }} />
      {text}
    </span>
  );

class ViewEvent extends React.Component {

    showModal = () => {
        this.setState({
          visible: true,
        });
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
            },
            {
                title:'holi',
                description:'soy la descripción',
                tags:'tag',
                date:'date',
                time:'time',
                place:'place',
                photo:'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
                }
            ],

            
            }
    }
    
    render(){

        let eventItems = this.state.events.map(
            (event) => {
                return(
                <Card
            alignContent='center'
            style={{width:'30vw', minWidth:400, borderColor:'gray', borderRadius:20}}
            cover={
            <div style={{display:"flex", justifyContent:"center", alignItems:"center", marginTop:"5%" }}>
            <img
                style={{width: '90%', height: '90%'}}
                alt="Foto del evento"
                src={event.photo}
            />
            </div>    
            }
           
        >
            <Meta
            style={{textAlign:'center'}}
            title= {event.title}
            />
            <br/>
            <Meta
            style={{color:'#2F3E9E'}}
            description={event.description}
             />
            <br/>
            <br/>
            
            <Tag>{event.tags}</Tag>
            <Tag>{event.tags}</Tag>
            <Tag>{event.tags}</Tag>
            <Divider/>
            <IconText type="calendar" text={event.date}/>
            <br/>
            <IconText type="clock-circle" text={event.time}/>
            <br/>
            <IconText type="environment" text={event.place}/>
            <br/>
            <br/>
            <Row type='flex' justify='center' align='middle' gutter={50}>
                <Col>
                    <Button size='large' style={{width:'100%', borderRadius:'10%', color:'#fff', backgroundColor:'#FF5126', borderColor:'FF5126'}}>Editar</Button>
                </Col>
                <Col >
                    <Button onClick={this.showModal} size='large' style={{width:'100%', borderRadius:'10%', color:'#fff', backgroundColor:'#8F9AE0', borderColor:'#8F9AE0'}}>Eliminar</Button>
                </Col>
            </Row>
            <Modal
                title="¿Está seguro(a) que desea eliminar el evento?"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                footer={[
                <Button key="back" onClick={this.handleCancel}>
                    Cancelar
                </Button>,
                <Button key="submit" htmlType="submit" type="primary" onClick={this.handleOk}>
                   Eliminar
                </Button>,
                ]}
            >
                <p>Si elimina el evento ni usted ni los egresados suscritos a este podrán verlo de nuevo.</p>
            </Modal>

            
        </Card>
                )
            }
        )

        return(
    <div style={{display:"flex", justifyContent:"center", alignItems:"center", backgroundColor:'#E5E9FF' }}>       
        <Row > {eventItems}      
            
            
        </Row>
        
    </div>  )
    }
      }

export default ViewEvent
         