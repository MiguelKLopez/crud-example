// Componente Tabla
import '../css/Tabla.css'
import React, { useState } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { AiFillEdit } from "react-icons/ai";
import { AiFillDelete } from "react-icons/ai";

function Tabla({usuarios, editUsuario, updateUsuarios}) {
  // Estado
  const [modalOpen, setModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);

  // Funciones para manejar el estado
  const openEditModal = (user) => {
    setUserToEdit(user);
    setModalOpen(true);
  }

  const closeModal = () => {
    setModalOpen(false);
  }

  const handleSave = (updatedUser) => {
    // Aquí puedes realizar acciones adicionales antes de cerrar el modal
    // como enviar los datos actualizados al servidor.
    updateUsuarios(updatedUser);
    closeModal();
  };

  // Renderizado 
  return (
    <>
      <Table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Edad</th>
            <th>Editar / Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(usuario => (
              <tr key={usuario.id}>
              <td>{usuario.nombre}</td>
              <td>{usuario.apellido}</td>
              <td>{usuario.edad}</td> 
              <td className='buttons-td'> 
                <Button className='btn-primary' onClick={() => openEditModal(usuario)}><AiFillEdit /></Button>
                <Button className='btn-danger'><AiFillDelete /></Button>
              </td> 
              </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={modalOpen} onHide={closeModal}>
        <Modal.Header>
          Editar Usuario
        </Modal.Header>
        
        <Modal.Body>
        <EditUserForm
            user={userToEdit}
            onClose={handleSave}
            updateUsuarios={updateUsuarios}
          />
        </Modal.Body>
      </Modal>
    </>
  )

}

export function EditUserForm({ user, onClose, updateUsuarios }) {
  const [formData, setFormData] = useState({
    nombre: user && user.nombre ? user.nombre : '',
    apellido: user && user.apellido ? user.apellido : '',
    edad: user && user.edad ? user.edad : 0,
    id: user && user.id ? user.id : '',
  });

  console.log(formData);  

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async (updatedUser) => {
    try {
      // Make a PUT request to the server
      const response = await fetch('http://localhost:3001/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });
  
      if (response.ok) {
        console.log('Usuario actualizado correctamente');
        updateUsuarios(updatedUser); // Update the state in your component
        onClose(); // Close the modal
      } else {
        console.error('Error al actualizar el usuario');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };
  

  return (
    <Form>
      <Form.Group className="mb-3" controlId="formBasicNombre">
        <Form.Label>Nombre</Form.Label>
        <Form.Control
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicApellido">
        <Form.Label>Apellido</Form.Label>
        <Form.Control
          type="text"
          name="apellido"
          value={formData.apellido}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicEdad">
        <Form.Label>Edad</Form.Label>
        <Form.Control
          type="number"
          name="edad"
          value={formData.edad}
          onChange={handleChange}
        />
      </Form.Group>

      <center>
        <Button className="btn-info" onClick={() => handleSave(formData)}>
          Guardar
        </Button>
      </center>
    </Form>
  );
}

export default Tabla;