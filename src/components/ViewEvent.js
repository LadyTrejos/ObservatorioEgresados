import React from 'react';
import 'antd/dist/antd.css';
import axios from 'axios'
import history from '../helpers/history';
import { Card, Icon, Tag, Divider, Row, Col, Button, Modal, List, Empty } from 'antd';
import HOSTNAME from '../helpers/hostname';

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
            interests: {}
        }
        this.showConfirm = this.showConfirm.bind(this)
    }

    componentDidMount(){
      axios.get(`${HOSTNAME}/api/intereses/`)
      .then(res => {
        let interests = {}
        res.data.map( item => 
          interests[item.id] = item.name
        )
        this.setState({ interests: interests })
      })
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


      showConfirm(item) {

        confirm({
          title: '¿Está seguro(a) que desea eliminar este evento?',
          content: 'Si elimina el evento ni usted ni los egresados suscritos a este podrán verlo de nuevo.',
          onOk: () => {
            console.log(this.state)
            axios.delete(`${HOSTNAME}/api/eventos/${item.id}/`)
            .then(() => 
              this.props.loadData()
            )
          },
          onCancel() {},
        });
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
                pageSize: 2
              }}
              dataSource={this.props.data}
              renderItem={item => (
                <div style={{display:"flex", justifyContent:"center", alignItems:"center" }}>
                  <Card
                    style={{width:'30vw', minWidth:300, borderColor:'gray', borderRadius:20}}
                    cover={
                      <div
                        style={{display:"flex", justifyContent:"center", alignItems:"center", marginTop:"5%" }}>
                        <img
                            style={{width: '90%', height: '90%'}}
                            alt="Foto del evento"
                            src={item.url}
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
                      style={{color:'#2F3E9E', overflowWrap: 'break-word'}}
                      description={item.description}
                    />
                    <br/>
                    <br/>
                    { item.interests.map( item => (
                      <Tag key={item}>{this.state.interests[item]}</Tag>
                      ))
                    }
                    <Divider/>
                    <IconText type="calendar" text={item.date}/>
                    <br/>
                    <IconText type="clock-circle" text={item.hour}/>
                    <br/>
                    <IconText type="environment" text={item.place}/>
                    <br/>
                    <br/>
                    <Row type='flex' justify='center' align='middle' gutter={50}>
                        <Col>
                            <Button 
                            size='large'
                            style={{width:'100%', borderRadius:'10%', color:'#fff', backgroundColor:'#FF5126', borderColor:'FF5126'}}
                            onClick={() => history.push(`/editar-evento/${item.id}`)}>
                              Editar
                            </Button>
                        </Col>
                        <Col>
                            <Button onClick={() => {this.showConfirm(item)}} size='large' style={{width:'100%', borderRadius:'10%', color:'#fff', backgroundColor:'#8F9AE0', borderColor:'#8F9AE0'}}>
                              Eliminar
                            </Button>
                        </Col>
                    </Row>
                </Card>
              </div>
            )}
          />
          :
          <Row type="flex" justify="center" align="middle">
            <Empty description={<span style={{fontSize:20, color:'#001870'}}>No se han creado eventos.</span>}/>
          </Row>
          }
          </div>  
        );
    }
}

export default ViewEvent
