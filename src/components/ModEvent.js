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
    Icon,
    Upload,
    Modal,
    message
  } from 'antd';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';

import history from '../helpers/history';
import HOSTNAME from '../helpers/hostname';

const { Option } = Select;
const { TextArea } = Input;
  
  
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
    constructor(props) {
        super(props);
            this.state = {
                previewVisible: false,
                previewImage: '',
                fileList: [  ],
            };
            
            console.log("aca-->"+this.previewImage)
        }
    
   
     handleCancel = () => {this.setState({ previewVisible: false });}
   
     handlePreview = async file => {
        if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
        previewImage: file.url || file.preview,
        previewVisible: true,
        });
  };

  /* handleChange = (info) => {
     if (info.file.status === "uploading") {
       this.setState({ loading: true });
       return;
      }
      if (info.file.status === "done") {
        // Get this url from response in real world.
        console.log(info.fileList)
        this.setState({ fileList: info.fileList })
    }
 };*/

    handleChange = async info => {
        if (!info.file.url && !info.file.preview) {
            info.file.preview = await getBase64(info.file.originFileObj)
        }
    
        this.setState({
        previewImage: info.file.url || info.file.preview,
        fileList: info.fileList 
        });
    };
    

    beforeUpload = (file) => {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJPG) {
        message.error('Solo se pueden subir imágenes');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('La imagen debe ser menor a 2MB');
      }
      return isJPG && isLt2M;
    }

   render() {
       console.log(this.state)
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
           name="avatar"
           action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
           className="avatar-uploader"
           listType="picture-card"
           fileList={fileList}
           onPreview={this.handlePreview}
           onChange={this.handleChange}
           beforeUpload={this.beforeUpload}
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
    constructor(props) {
      super(props);
      this.state = {
        eventInfo: {

            name:"", 
            description:"",
            place: "",
            date:"", 
            hour: "",
            organizer:"",
            admin: localStorage.getItem('user'),      
            interests:[],
            url:''
        },
        interests: []
    };
    this.imageRef = React.createRef();
  }

    componentWillMount(){
        const eventID = this.props.match.params.id;
        axios.get(`${HOSTNAME}/api/eventos/${eventID}/`)
        .then(res => {
        this.setState({ 
            eventInfo: {
            name: res.data.name,
            description: res.data.description,
            place: res.data.place,
            date: moment(res.data.date,"YYYY-MM-DD"),
            hour: res.data.hour,
            organizer: res.data.organizer,
            admin: res.data.admin,       
            interests: res.data.interests,
            url: res.data.url,
            }
        })
        })
       
    }

    componentDidMount(){
      
        axios.get(`${HOSTNAME}/api/intereses/`)
        .then( res => {
            let interests = {}
            res.data.map( item => 
                interests[item.id] = item.name
                )
            let data = this.state.eventInfo.interests.map( item => `${item}>${interests[item]}`)
            console.log(data)
            this.setState({ interests: res.data, eventInfo: { ...this.state.eventInfo, interests: data}},()=>console.log(this.state.eventInfo))
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
      return (
        (current && current < moment()) ||
      (current && current > moment().add(2, "year"))
      );
    }

    handleInterestChange = (value) => {
        this.setState({
            eventInfo: { ...this.state.eventInfo, interests: value}
        }, () => console.log(this.state))
        
    }

    putEvent = (interests,id) => {
        let urlImage = this.imageRef.current.state.previewImage;
        let date_string = this.state.eventInfo.date;

        if(urlImage===""){
            urlImage=this.state.eventInfo.url
        }
        
        if(typeof(this.state.eventInfo.date)==="object"){
            date_string = this.state.eventInfo.date.format('DD-MM-YYYY')
        }
        
        this.setState({
            eventInfo: { ...this.state.eventInfo, interests: interests, url:urlImage, date: date_string}
        }, () => {
            
            const eventData = JSON.stringify(this.state.eventInfo)
            
            axios.put(`${HOSTNAME}/api/eventos/${id}/`, 
                        eventData, 
                        { headers: {"Content-type": "application/json"}})
            .then((res) => {
              message.success('El evento ha sido editado con éxito.', 10)
              history.push('/eventos')
            })
            .catch(err => {
                console.log(err.message)
              })
        })
    }

   

    handleCreate = (e,id) => {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
          values = {...values, admin: localStorage.getItem('user')}
        if (!err) {
          let interests = [], promises = [];
          let data = ''
          values.interests.forEach((interest, i) => {
              if(interest.includes('>')) {
                  data = interest.split('>')
                  interests.push(data[0])
              } else {
                  console.log("acá")
                  console.log(interest)
                promises.push(axios.post(`${HOSTNAME}/api/intereses/`,
                `{"name": "${interest}"}`,
                { headers: {"Content-type": "application/json"}}
                )
    )
                  
              }
          })
          axios.all(promises)
          .then(results => {
            results.forEach(item => interests.push(item.data.id))
            this.putEvent(interests,id)
          }
          )
        }
    });
    }

    render() {
        console.log(this.state.eventInfo)
        
      const { getFieldDecorator } = this.props.form;
      const interestItems = [] 
      
      this.state.interests.map( (item) => 
          interestItems.push(<Option key={item.id} value={`${item.id}>${item.name}`}>{item.name}</Option>)
      );


      return (
        
        <Form layout="vertical" >
          <h1 style={{textAlign:'center', fontSize:30, color:'#001870'}}>Editar evento</h1>


          <Row type="flex" justify="center" align="middle">
            <Col span={5}>
              <Form.Item label="Imagen de portada del evento">
                  {getFieldDecorator('url', )(<PicturesWall ref={this.imageRef}/>
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
                  initialValue: this.state.eventInfo.name
                })(<Input
                      placeholder='Nombre del evento'
                      size='large'
                      onChange={e => {this.setState({ eventInfo: {...this.state.eventInfo, name: e.target.value}})}}
                      style={{backgroundColor:'#fff', borderColor:'#fff',borderRadius:10}}
                    />
                  )}
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
                  initialValue: this.state.eventInfo.description
                })(<TextArea rows={4}
                      placeholder='Descripción de evento'
                      size='large'
                      onChange={e => {this.setState({ eventInfo: {...this.state.eventInfo, description: e.target.value}})} }

                      style={{backgroundColor:'#fff', borderColor:'#fff',borderRadius:10}}/>)}

              </Form.Item>
            </Col>
          </Row>


          <br/>
          <Row  type="flex" justify="center" align="middle" gutter={20}>
            <Col>
              <Form.Item label="Fecha del evento">
                {getFieldDecorator('date', {
                  rules: [{ required:true, message: 'Ingresar la fecha del evento' }],
                  initialValue: this.state.eventInfo.date
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


            <Col>
              <Form.Item label="Hora del evento">
                {getFieldDecorator('hour', {
                  rules: [{ required: true, message: 'Ingresar la hora del evento' }],
                   initialValue:moment(this.state.eventInfo.hour, 'HH:mm:ss')
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
                  rules: [{ required:true, message: '¿Dónde se realizará?' },
                  {pattern: /^[a-z\u00f1\u00d1\u00c1\u00c9\u00cd\u00d3\u00da]+([ ]?[0-9a-z\u00f1\u00d1\u00c1\u00c9\u00cd\u00d3\u00da\-\#]+)*$/gi, 
                    message: "Dirección no válida"}],
                    initialValue: this.state.eventInfo.place
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
                    {pattern: /^[a-z\u00f1\u00d1\u00c1\u00c9\u00cd\u00d3\u00da]+([ ]?[a-z\u00f1\u00d1\u00c1\u00c9\u00cd\u00d3\u00da]+)*$/gi, 
                      message: "Nombre no válido"}
                  ],
                  initialValue: this.state.eventInfo.organizer
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
                <Form.Item label="Intereses" extra="Para añadir un nuevo interés escriba el nombre en este espacio y finalice con la tecla Enter">
                    {getFieldDecorator('interests', {
                        rules: [
                        { required: true, message: 'Seleccione al menos un interés', type: 'array' },
                        
                        ],
                        initialValue: this.state.eventInfo.interests
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
                    onClick={(e)=>this.handleCreate(e,this.props.match.params.id)}
                    style={{backgroundColor:'#FF5126', borderColor:'#FF5126'}}>
                  Guardar
                </Button>
              </Form.Item>
            </Col>

            <Col >
              <Form.Item>
                <Button 
                    size='large' 
                    type="primary" 
                    onClick={() => history.push(`/eventos/`)}
                    style={{backgroundColor:'#8F9AE0', borderColor:'#8F9AE0'}} >

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