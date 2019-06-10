import React from 'react';
import {
    Form,
    Input,
    Select,
    Row,
    Col,
    DatePicker,
    Button,
    TimePicker,
    Checkbox,
    Icon,
    Upload,
    Modal,
    message
  } from 'antd';
import moment from 'moment';
import { withRouter, Link } from 'react-router-dom';
import axios from 'axios';

import './CreateAdmin.css';

  const { Option } = Select;


  const { TextArea } = Input;
  
  /* intereses */
  const CheckboxGroup = Checkbox.Group;
  const plainOptions = ['Deporte', 'Cultura', 'Familiar','Ocio','Academia','Social',];
  const defaultCheckedList = ['Social','Academia'];
  class App extends React.Component {
  state = {
    checkedList: defaultCheckedList,
    indeterminate: true,
    checkAll: false,
  };

  onChange = checkedList => {
    this.setState({
      checkedList,
      indeterminate: !!checkedList.length && checkedList.length < plainOptions.length,
      checkAll: checkedList.length === plainOptions.length,
    });
  };

  onCheckAllChange = e => {
    this.setState({
      checkedList: e.target.checked ? plainOptions : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
  };

  render() {
    return (
      <div>
        <div style={{ borderBottom: '1px solid #E9E9E9' }}>
          <Checkbox
            indeterminate={this.state.indeterminate}
            onChange={this.onCheckAllChange}
            checked={this.state.checkAll}
          >
            Seleccionar todos
          </Checkbox>
        </div>
        <br />
        <CheckboxGroup
          options={plainOptions}
          value={this.state.checkedList}
          onChange={this.onChange}
        />
      </div>
    );
  }
}
/* fin de intereses*/
 /* imagenes*/
 function getBase64(file) {
   return new Promise((resolve, reject) => {
     const reader = new FileReader();
     reader.readAsDataURL(file);
     reader.onload = () => resolve(reader.result);
     reader.onerror = error => reject(error);
   });
 }

 class PicturesWall extends React.Component {
   state = {
     previewVisible: false,
     previewImage: '',
     fileList: [  ],
   };

   handleCancel = () => this.setState({ previewVisible: false });

   handlePreview = async file => {
     if (!file.url && !file.preview) {
       file.preview = await getBase64(file.originFileObj);
     }

     this.setState({
       previewImage: file.url || file.preview,
       previewVisible: true,
     });
   };

   handleChange = ({ fileList }) => this.setState({ fileList });

   render() {
     const { previewVisible, previewImage, fileList } = this.state;
     const uploadButton = (
       <div>
         <Icon type="plus" />
         <div className="ant-upload-text">Subir</div>
       </div>
     );
     return (
       <div className="clearfix">
         <Upload
           action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
           listType="picture-card"
           fileList={fileList}
           onPreview={this.handlePreview}
           onChange={this.handleChange}
         >
           {fileList.length >= 1   ? null : uploadButton}
         </Upload>
         <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
           <img alt="Portada del evento" style={{ width: '100%' }} src={previewImage} />
         </Modal>
       </div>
     );
   }
 }
/* fin de imagenes */











  class createEvento extends React.Component {
    state = {
        eventInfo: {
            name:'',
            description:'',
            place:'',
            date:'',
            hour:'',
            organizer:'',
            created_at: moment().format('DD-MM-YYYY'),
            admin: localStorage.getItem('user'),
            interests: []
        },
        interests: []
    };

    componentDidMount(){
        axios.get('http://127.0.0.1:8000/api/intereses/')
        .then( res => {
            this.setState({ interests: res.data})
        })
        .catch( err => console.log(err.message))
    }

    onChange = e => {
      const { value } = e.target;
      const reg = /^(0|[1-9][0-9]*)([0-9]*)?$/;
      if ((!Number.isNaN(value) && reg.test(value)) || value === '' || value === '-') {
        this.props.onChange(value);
      }
    };

    disabledDate = (current) => {
      let min = "1942-01-01";
      return (
        (current && current < moment(min, "YYYY-MM-DD")) ||
        (current && current < moment().add( "year"))
      );
    }

    handleInterestChange = (value) => {
        this.setState({
            eventInfo: { ...this.state.eventInfo, interests: value}
        })
        
    }

    postEvent = (interests) => {
        this.setState({
            eventInfo: { ...this.state.eventInfo, interests: interests}
        }, () => {
            const eventData = JSON.stringify(this.state.eventInfo)
            axios.post('http://127.0.0.1:8000/api/eventos/', 
                        eventData, 
                        { headers: {"Content-type": "application/json"}})
            .then((res) => message.success('El evento ha sido creado con éxito.', 10))
            .catch(err => {
                console.log(err.message)
              })
        })
    }

    handleCreate = () => {
        
        let interests = [], promises = [];
        let data = ''
        this.state.eventInfo.interests.forEach((interest, i) => {
            if(interest.includes('>')) {
                data = interest.split('>')
                interests.push(data[0])
            } else {
                promises.push(axios.post('http://127.0.0.1:8000/api/intereses/',
                            `{"name": "${interest}"}`,
                            { headers: {"Content-type": "application/json"}}
                            )
                )
            }
        })
        axios.all(promises)
        .then(results => {
          results.forEach(item => interests.push(item.data.id))
          console.log(interests)
          this.postEvent(interests)
        }
        )
    }

    render() {

      const { getFieldDecorator } = this.props.form;

      const interestItems = [] 
      
      this.state.interests.map( (item) => 
          interestItems.push(<Option key={item.id} value={`${item.id}>${item.name}`}>{item.name}</Option>)
      );


      return (
        <Form layout="vertical" >
          <h1 style={{textAlign:'center', fontSize:30, color:'#001870'}}>Crear evento</h1>


          <Row type="flex" justify="center" align="middle">
            <Col span={5}>
              <Form.Item label="Imagen de portada del evento">
                  {getFieldDecorator('multimedia', )
                  (<PicturesWall />

                  )}
                </Form.Item>
            </Col>
          </Row>

          <Row  type="flex" justify="center" align="middle">
            <Col span={7}>
              <Form.Item
                label='Nombre'
              >
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: 'Ingrese el nombre del evento', whitespace: true }],
                })(<Input
                      
                      placeholder='Nombre del evento'
                      size='large'
                      onChange={e => {this.setState({ eventInfo: {...this.state.eventInfo, name: e.target.value}})}}
                      style={{backgroundColor:'#fff', borderColor:'#fff',borderRadius:10}}/>)}

              </Form.Item>
            </Col>
          </Row>


          <Row  type="flex" justify="center" align="middle">

            <Col span={7}>
              <Form.Item
                label='Descripción'
              >
                {getFieldDecorator('description', {
                  rules: [{ required: true, message: 'Ingrese descripción del evento', whitespace: true }],
                })(<TextArea rows={4}
                      placeholder='Descripción de evento'
                      size='large'
                      onChange={e => {this.setState({ eventInfo: {...this.state.eventInfo, description: e.target.value}})} }

                      style={{backgroundColor:'#fff', borderColor:'#fff',borderRadius:10}}/>)}

              </Form.Item>
            </Col>
          </Row>


          <br/>
          <Row  type="flex" justify="center" align="middle">
            <Col span={5}>
              <Form.Item label="Fecha del evento">
                {getFieldDecorator('date', {
                  rules: [{ required:true, message: 'Ingresar la fecha del evento' }],
                }) (
                  <DatePicker
                    placeholder='Seleccione fecha'
                    size='large'
                    onChange={(date, dateString) => this.setState({ eventInfo: {...this.state.eventInfo, date: dateString }})}
                    format="DD-MM-YYYY"
                    disabledDate={this.disabledDate}

                  />
                  )}
              </Form.Item>

            </Col>


            <Col span={4.5}>
              <Form.Item label="Hora del evento">
                {getFieldDecorator('hour  ', {
                  rules: [{ required:true, message: 'Ingresar la hora del evento' }],
                  setFieldsValue:this.state.hour,
                  initialValue: moment('00:00:00', 'HH:mm:ss')
                })(
                    <TimePicker
                        size='large'
                        placeholder="Hora del evento"
                        onChange={(_, timeString) => 
                            this.setState({ eventInfo: {...this.state.eventInfo, hour: timeString} })} 
                    />
                  )}
              </Form.Item>
            </Col>
          </Row>

            <br/>

          <Row  type="flex" justify="center" align="middle">
            <Col span={7}>
              <Form.Item label="Lugar del evento">
                {getFieldDecorator('place', {
                  rules: [{ required:true, message: '¿Dónde se realizará?' }],
                })(
                    <Input
                    placeholder='Lugar del evento'
                    size='large'
                    onChange={e => {this.setState({ eventInfo: {...this.state.eventInfo, place: e.target.value }})}}
                    style={{backgroundColor:'#fff', borderColor:'#fff',borderRadius:10}}/>
                  )}
              </Form.Item>
            </Col>
          </Row>


          <Row  type="flex" justify="center" align="middle">
            <Col span={7}>
              <Form.Item label="Organizador">
                {getFieldDecorator('organizer', {
                  rules: [
                    {
                      required: true,
                      message: '¿Quién organiza el evento?',
                    },
                  ],
                })(<Input
                      placeholder='Nombre, asociación o institución '
                      size='large'
                      onChange={e => {this.setState({ eventInfo: {...this.state.eventInfo, organizer: e.target.value}})}}
                      style={{backgroundColor:'#fff', borderColor:'#fff',borderRadius:10}}/>)}
              </Form.Item>
            </Col>
          </Row>

          <Row type="flex" justify="center" align="middle">
            <Col span={7}>
                <Form.Item label="Intereses">
                    {getFieldDecorator('interests', {
                        rules: [
                        { required: true, message: 'Seleccione al menos un interés', type: 'array' },
                        ],
                    })(
                        <Select 
                        size='large'
                        mode="tags"
                        placeholder="Seleccione intereses relacionados con el evento"
                        tokenSeparators={[","]}
                        onChange={(e) => this.handleInterestChange(e)}
                        >
                            {interestItems}
                        </Select>,
                    )}
                </Form.Item>
            </Col>
          </Row>


          <Row type="flex" justify="center" align="middle" gutter={20}>
            <Col>
              <Form.Item>
                <Button 
                    size='large' 
                    type="primary"
                    href='/eventos'
                    onClick={this.handleCreate}
                    style={{backgroundColor:'#FF5126', borderColor:'#FF5126'}}>
                  Crear
                </Button>
              </Form.Item>
            </Col>

            <Col >
              <Form.Item>
                <Button 
                    size='large' 
                    type="primary" 
                    href='/eventos'
                    style={{backgroundColor:'#8F9AE0', boderColor:'#8F9AE0'}} >

                Cancelar
                </Button>
              </Form.Item>
            </Col>
          </Row>


        </Form>
      );
    }
  }

  const CreateEvent = Form.create({ name: 'createEvent' })(createEvento);



  export default withRouter(CreateEvent);