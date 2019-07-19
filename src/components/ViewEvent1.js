import React from 'react';
import 'antd/dist/antd.css';
import axios from 'axios'
import { Card, Icon, Tag, Divider, Row, Col, Button, List, Empty, message } from 'antd';
import HOSTNAME from '../helpers/hostname';

const { Meta } = Card;

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
            interests: {},
            suscrito:false,
            events:[]

        }
        this.ToSuscribe = this.ToSuscribe.bind(this)
    }

    componentWillMount(){
      const graduatedID = localStorage.getItem('user');
      axios.get(`${HOSTNAME}/api/egresados/${graduatedID}/`)
      .then(res => {
        this.setState({
          events:res.data.events
        })
      })
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

      ToSuscribe(id) {
            

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
            axios.patch(`${HOSTNAME}/api/egresados/${graduatedID}/`,
            EventData,
            { headers: {"Content-type": "application/json"}})
            .catch(err => 
              console.log(err)
            )
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
                      title= {<a href={`/evento/${item.id}/`}>{item.name}</a>}
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
                            <Button size='large' 
                            style={{width:'100%', borderRadius:'10%', color:'#fff', backgroundColor:'#FF5126', borderColor:'FF5126'}}
                            onClick={()=>{this.ToSuscribe(item.id)}}>
                            {this.state.events.includes(item.id) ? "Eliminar suscripción" : "Suscribirse"}
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
        )
    }
}

export default ViewEvent
