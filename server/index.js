const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');

const corsOptions = {
  origin: 'http://localhost:3000', // Reemplaza con el dominio de tu aplicación React
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,    
}

app.use(cors(corsOptions));
app.use(express.json());

const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',    
    database:'form',
});

app.listen(3001,()=>{
    console.log('Corriendo en el puerto 3001');
})

app.post('/create',(req,res)=>{
    const nombre=req.body.nombre;
    const apellido=req.body.apellido;
    const edad=req.body.edad;

    db.query // Insertar valores dentro de la base de datos
        ('INSERT INTO formulario (nombre, apellido, edad) VALUES (?,?,?)',
        [nombre, apellido, edad] , (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).send(err);
                return;
            }

            res.send('Usuario registrado');
        });
});

app.get('/formulario', (req, res) =>{
    db.query('SELECT * FROM formulario',
    (err, result) => {
        if(err){
            console.error(err);
            res.status(500).send(err);
            return;
        }
    res.send(result);
  });
});

app.put('/update',(req,res)=>{
    const nombre=req.body.nombre;
    const apellido=req.body.apellido;
    const edad=req.body.edad;
    const id=req.body.id;

    console.log('Datos recibidos en /update:', req.body);

    db.query // Insertar valores dentro de la base de datos
        ('UPDATE formulario SET nombre=?, apellido=?, edad=? WHERE id=?',
        [nombre, apellido, edad, id] , (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).send(err);
                return;
            }   
            console.log(result); 
            res.send('Usuario actualizado');
        });
});