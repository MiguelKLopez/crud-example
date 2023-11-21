import {React,useState,useEffect} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import '../css/Forms.css';
import Axios from 'axios';
import Tabla, { EditUserForm } from './Tabla';

// hacer una tabla que tenga los registros como arriba
// incluir los botones de agregar y eliminar 
// Nombre || Apellido || Edad || Grupo de botones
// Editar muestra los datos del form

function FormS() {
  const [Id, SetId] = useState();
  const [Editar, SetEditar] = useState(false);
  const [Nombre, SetNombre] = useState();
  const [Apellido, SetApellido] = useState();
  const [Edad, SetEdad] = useState(0);
  const [Usuarios, SetUsuarios] = useState([]);
  const [Loading, SetLoading] = useState(true);
  const [ModoEdicion, SetModoEdicion] = useState(false); 

  const add = (e) => {
    e.preventDefault();
    if (ModoEdicion) {
      update();
    } else {
      Axios.post('http://localhost:3001/create', {
        nombre: Nombre,
        apellido: Apellido,
        edad: Edad,
      })
        .then(() => {
          alert('Usuario registrado');
          getUsuarios();
        })
        .catch((error) => {
          console.log(error);
        });
    }
    
    // Restablecer el modo de edición
    SetModoEdicion(false);

    // Limpiar los campos después de agregar o editar
    SetNombre('');
    SetApellido('');
    SetEdad(0);
  };

  const update = (e) =>{
    Axios.put('http://localhost:3001/update',
    {
      // izquierda como lo va a recibir el servidor y derecha como lo tengo declrado
      id:Id,
      nombre:Nombre,
      apellido:Apellido,
      edad:Edad
    }).then((response)=>{
      getUsuarios();
      alert(response.data)
    });
  }

  const editarUsuario = (val) =>{
    SetEditar(true);
    SetModoEdicion(true); 
    SetNombre(val.nombre);
    SetApellido(val.apellido);
    SetEdad(val.edad);
    SetId(val.id);
  }

  const getUsuarios = () =>{
    return Axios.get('http://localhost:3001/formulario')
    .then(response => { 
        SetUsuarios(response.data);
        // Recargar usuarios
        getUsuarios();
    })
  }

  useEffect(() => {
    getUsuarios().then(() => {
      SetLoading(false); 
    });
  }, [])
  
  if(Loading) {
    console.log('cargando...');
  }

  return (
    <div>
        <div className='forms-container'>
            <Form className='FormA'>

            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Nombre</Form.Label>
                <Form.Control 
                    type="text" 
                    placeholder="Miguel" 
                    value={Nombre}
                    onChange={(event) => { SetNombre(event.target.value) }}/>
                <Form.Text className="text-muted"></Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Apellido</Form.Label>
                <Form.Control 
                    type="text" 
                    placeholder="López" 
                    value={Apellido}
                    onChange={(event) => { SetApellido(event.target.value) }}/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Edad</Form.Label>
                <Form.Control 
                    type="int"  
                    placeholder="18"
                    value={Edad}
                    onChange={(event) => { SetEdad(event.target.value) }}/>
            </Form.Group>

            <center>
                <Button 
                    type="submit" 
                    className='ButtonA btn-info'
                    onClick={add}>    
                    Guardar
                </Button>
            </center>
            </Form>
        </div>

      <div className='table-container'>
        <Tabla 
          usuarios={Usuarios}
          updateUsuarios={update}
          editUsuario={editarUsuario}
        />
      </div>

    </div>
  );
}

export default FormS;