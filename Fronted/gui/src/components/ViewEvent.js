
import React from 'react';
import 'antd/dist/antd.css';
import { Card, Icon, Tag, Divider, Row } from 'antd';

const { Meta } = Card;

const IconText = ({ type, text }) => (
    <span>
      <Icon type={type} style={{ marginRight: 8 }} />
      {text}
    </span>
  );

let titulo= 'SOY EL TÍTULO DEL EVENTO';
let descripcion = 'Soy una descripción';

class ViewEvent extends React.Component {
    
    render(){
        return(
    <div style={{display:"flex", justifyContent:"center", alignItems:"center", backgroundColor:'#E5E9FF' }}>       
        <Row >       
            <Card
                alignContent='center'
                style={{width:'30vw', minWidth:400, borderColor:'gray', borderRadius:20}}
                cover={
                <div style={{display:"flex", justifyContent:"center", alignItems:"center", marginTop:"5%" }}>
                <img
                    alt="Foto del evento"
                    src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                />
                </div>    
                }
               
            >
                <Meta
                style={{textAlign:'center'}}
                title= {titulo}
                />
                <br/>
                <Meta
                style={{color:'#2F3E9E'}}
                description={descripcion}
                 />
                <br/>
                <br/>
                
                <Tag>tag</Tag>
                <Tag>tag</Tag>
                <Tag>tag</Tag>
                <Tag>tag</Tag>
                <Divider/>
                <IconText type="calendar" text='date'/>
                <br/>
                <IconText type="clock-circle" text='time'/>
                <br/>
                <IconText type="environment" text='place'/>
                
            </Card>
            
        </Row>
        
    </div>  )
    }
      }

export default ViewEvent
         