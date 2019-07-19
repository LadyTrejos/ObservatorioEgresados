import React from 'react';
import axios from 'axios';

import {
  Form,
  Icon,
  Button,
  Modal,
  message,
  Upload
} from 'antd';
import HOSTNAME from '../helpers/hostname';


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
 
     handleChange = ({ fileList }) => this.setState({ fileList });
 
 
     beforeUpload = (file) => {
       const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
       if (!isJPG) {
         message.error('Solo se pueden subir imágenes');
       }
 
       return isJPG;
     }
 
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


class ChangeImageModal extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      
    }
    this.imageRef = React.createRef();
  }

  handleImageChange = (e, id) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const image = this.imageRef.current.state.fileList[0].originFileObj
        const id = this.props.eventID;
        let eventData = new FormData();
        eventData.append('url', image);
        axios.patch(`${HOSTNAME}/api/eventos/${id}/`,
                    eventData,
                    { headers: {"Content-type": 'multipart/form-data'}})
        .then((res) => {
            message.success('La imagen se ha cambiado exitosamente.', 10)
            this.setState({
                visiblePassword: false,
              });
        })
        .catch(err => {
            console.log(err.message)
            })
        
      }
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visiblePassword: false,
    });
  };
  
  showModalPassword = () => {
    this.setState({
      visiblePassword: true,
    });
  };


   render(){
       console.log('id del evento ',this.props.eventID)
      const {getFieldDecorator} = this.props.form;
       return(
            <Form.Item>
              <Button onClick={this.showModalPassword} size='large' type="primary"  
                style={{backgroundColor:'#8F9AE0', 
                borderColor:'#8F9AE0'}}
              >
                  Cambiar la imagen de portada
              </Button>
              <Modal
                  onCancel={this.handleCancel}
                  title="Cambiar imagen de portada"
                  visible={this.state.visiblePassword}
                  footer={[
                    <Button key="back" onClick={this.handleCancel}>
                      Cancelar
                    </Button>,
                    <Button 
                        key="save" 
                        onClick={this.handleImageChange}>
                      Guardar
                  </Button>
                  ]}
                >
                    <Form.Item label="Nueva imagen">
                        {getFieldDecorator('url',
                        )(<PicturesWall ref={this.imageRef}/>)}
                    </Form.Item>

                    
              </Modal>
            </Form.Item>
       )
   }

  }
  
  const ChangeEventImage = Form.create({ name: 'change_image' })(ChangeImageModal);


  export default ChangeEventImage;


