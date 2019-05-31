import React from 'react';
import { Form, Input, Button } from 'antd';
import axios from 'axios';

class CustomForm extends React.Component {

    handleFormSubmit = (event, requestType, egresadoID) => {
        event.preventDefault();
        const name = event.target.elements.name.value;
        const lastname = event.target.elements.lastname.value;
        
        switch (requestType) {
            case 'post':
                return axios.post('http://127.0.0.1:8000/api/', {
                    name: name,
                    lastname: lastname
                })
                .then(response => { 
                    console.log(response)
                })
                .catch(error => {
                    console.log(error.response)
                });
            case 'put':
                return axios.put(`http://127.0.0.1:8000/api/${egresadoID}/`, {
                    name: name,
                    lastname: lastname
                })
                .then(response => { 
                    console.log(response)
                })
                .catch(error => {
                    console.log(error.response)
                });
        }
    }

    render() {
        
        return (
        <div>
            <Form onSubmit={(event) => this.handleFormSubmit(
                event, this.props.requestType, this.props.articleID
            )}>
            <Form.Item label="Nombre: ">
                <Input name="name" placeholder="Ingrese su nombre" />
            </Form.Item>
            <Form.Item label="Apellido: ">
                <Input name="lastname" placeholder="Ingrese su apellido" />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">{this.props.btnText}</Button>
            </Form.Item>
            </Form>
        </div>
        );
    }
}

export default CustomForm;