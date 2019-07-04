import React from 'react';
import {
    Form,
    Layout,
    Card
  } from 'antd';
  import logo from '../static/img/logo.png'

  const { Content} = Layout;

class PrivacyClass extends React.Component {
state={
    events: []
}
render(){
    return(
        <div>
            <div style={{color:'#fff', backgroundColor:'#8796F0', textAlign: 'center', fontSize:'200%', height:'20%'}}>
                <img src={logo} alt="Logo de la página" style={{width: 40, height: 40}}/>
                <strong>Observatorio de egresados</strong>
            </div>
            <div style={{color:'#000', backgroundColor:'#E5E9FF', textAlign: 'left', justifyItems:'center', height:'100vh',}}>
                <Card style={{height:'80vh',width:'50%', borderRadius:'20px', left:'25%', top:'5%' }}>
                    
                    <p>
                        <br/><strong >POLÍTICAS DE PRIVACIDAD</strong><br/><br/>
                        -  Se recolectan los datos personales de cada usuario para el tratamiento y administración de la
                        información de la asociación de egresados de la UTP<br/><br/>
                        -  Los usuarios que son egresado podrán ver su propia información y editarla.<br/><br/>
                        -  Los administradores podrán ver la información completa de los usuarios egresados y editar sus datos.<br/><br/>
                        -  Si se detectan malas conductas por parte de usuarios egresados, cualquier administrador está en el derecho de inhabilitarlo de la plataforma.<br/><br/>
                        -  Los usuarios egresados podrán ver el nombre, apellido, correo electrónico, intereses y carrera de los demás egresados.
                    </p>
                
                </Card>
            </div>
        </div>
    )
}

}

const Privacy = Form.create({ name: 'ModEgresado' })(PrivacyClass);

export default Privacy;