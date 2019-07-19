import React from 'react';
import 'antd/dist/antd.css';
import { Comment, Form, Button, List, Input, Upload, Icon, Modal, Avatar, Tooltip, Divider, message } from 'antd';
import moment from 'moment';
import axios from 'axios';
import HOSTNAME from '../helpers/hostname';

const { TextArea } = Input;

function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

class PostList extends React.Component {
  state = {
    comments: [],
    submitting: false,
    value: '',
    previewVisible: false,
    previewImage: '',
    fileList: [],
  };
  
  componentWillMount() {
      this.loadComments();
  }
  // Inicio imagenes
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

  // Fin imagenes

  handleSubmit = () => {
    if (!this.state.value && this.state.fileList.length === 0) {
      return;
    }

    this.setState({
      submitting: true,
    });
    const admin = localStorage.getItem('user');
    let postData = new FormData();
    const url = this.state.fileList[0] ? this.state.fileList[0].originFileObj : '';
    const type = this.state.fileList[0] ? this.state.fileList[0].type : '';
    postData.append('description', this.state.value);
    postData.append('admin', admin);
    postData.append('file_url', url);
    postData.append('file_type', type);
    postData.append('event', this.props.match.params.id);
    axios.post(`${HOSTNAME}/api/posts/`,
        postData,
        { headers: {"Content-type": 'multipart/form-data'}}
    )
    .then(res => this.setState({
        submitting: false,
        value: '',
        comments: [
            res.data,
            ...this.state.comments,
        ],
        fileList:[]
        })
    )
    
    
  };

  loadComments = () => {
      const eventID = this.props.match.params.id;
      axios.get(`${HOSTNAME}/api/posts/?event=${eventID}&ordering=-created_at`)
      .then(res => {
           this.setState({ comments: res.data})
      })
  }

  handleCommentChange = e => {
    this.setState({
      value: e.target.value,
    });
  };

  handleChange = ({ fileList }) => this.setState({ fileList });

  handleDeletePost = (id) => {
    axios.delete(`${HOSTNAME}/api/posts/${id}/`)
    .then(() => {
        window.location.reload();
        message.success('La publicación ha sido eliminada.')
    })
  }

  render() {
    const { comments, submitting, value } = this.state;
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Subir archivo</div>
      </div>
    );
    return (
      <div>
            <div>
                { this.props.admin ? 
                <React.Fragment>
                    <Form.Item>
                        <TextArea rows={3} onChange={this.handleCommentChange} value={value} />
                    </Form.Item>
                    <Form.Item>
                        <div className="clearfix">
                            <Upload
                            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                            listType="picture-card"
                            fileList={fileList}
                            onPreview={this.handlePreview}
                            onChange={this.handleChange}
                            >
                            {fileList.length >= 1 ? null : uploadButton}
                            </Upload>
                            <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                            <img alt="example" style={{ width: '100%' }} src={previewImage} />
                            </Modal>
                        </div>
                    </Form.Item>
                    <Form.Item>
                    <Button htmlType="submit" loading={submitting} onClick={this.handleSubmit} type="primary">
                        Publicar
                    </Button>
                    </Form.Item>
                </React.Fragment>
                :
                <div></div>
                }
            </div>
            {comments.length > 0 ? 
                <List
                dataSource={comments}
                header={`${comments.length} ${comments.length > 1 ? 'publicaciones' : 'publicación'}`}
                itemLayout="horizontal"
                renderItem={item =>
                    <React.Fragment>
                        <Divider/> 
                        <Comment 
                            actions={this.props.admin? [<Button type="danger" onClick={() => this.handleDeletePost(item.id)}>Eliminar</Button>] : null}
                            author="Administrador"
                            avatar={<Avatar  style={{backgroundColor: '#f56a00', verticalAlign: 'middle' }} size='large'>
                            A
                            </Avatar>}
                            content={
                                <div>
                                    {item.description}
                                    <br/>
                                    {
                                        ((/audio\/.*/).test(item.file_type)) ?
                                        <embed src={item.file_url} ></embed>
                                        :
                                        <embed src={item.file_url} style={{maxHeight:"60vh", maxWidth:"60vw",minHeight:"30vh", minWidth:"30vw"}}></embed>
                                    }
                                </div>
                            }
                            datetime={
                                <Tooltip title={moment(item.created_at, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')}>
                                <span>{moment(item.created_at, 'YYYY-MM-DD HH:mm:ss').fromNow()}</span>
                                </Tooltip>
                            }
                        />
                    </React.Fragment>
                }
              />
              :
              <div></div>
            }
      </div>
    );
  }
}

export default PostList;