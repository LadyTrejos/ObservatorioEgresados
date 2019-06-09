import React from 'react';
import {Form, Input,  Button} from 'antd';

import axios from 'axios';


class Email extends React.Component{
    constructor(){
        super()
        this.State={
            name:'',
            email:'',
            mesagge:','
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange = e => {
        this.setState({[e.target.name]:e.target.value})
    }

    async handleSubmit(e){
        e.preventDefautl()

        const {name, email, mesagge} = this.state
        const form = await axios.post('/api/form',{
            name,
            email,
            mesagge,
        })
    }

    render(){
        console.log(this.state)
        return(
           <Form onSubmit={this.handleSubmit}>
               <Form.Item label='nombre'>
                   
                   <Input type='text'
                   name='name'
                   onChange={this.handleChange
                   }/>
               </Form.Item>

               <Form.Item label='email'>
                   <Input type='email'
                   name='email'
                   onChange={this.handleChange
                   }/>
               </Form.Item>

               <Form.Item label='mensaje'>
                   <Input type='textarea'
                   name='mesagge'
                   onChange={this.handleChange
                   }/>

                   <Button>Submit</Button>
               </Form.Item>

           </Form>

        )
    }
}

export default Email;