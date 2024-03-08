const express = require('express');
const router = express.Router();

//Se trae la conexion a la base de datos
const pool = require('../database');

//Se traen los metodos para proteger las rutas
const {isLoggedIn} = require('../lib/auth');

const {checkRole} = require('../lib/role')

//Renderiza el handlebar con la extension "links/add" cuando el usuario se ubica sobre esta
router.get('/add', isLoggedIn,  (req, res) => {
    res.render('links/add');
})

//Recibe los datos que envia el usuario en el formulario para crear una cita
router.post('/add', isLoggedIn, async (req, res) => {
    {/* Se procesan los datos recibidos a traves de "req.body"*/}
    const { title, fecha, hora } = req.body;
    const newLink = {
        title,
        fecha,
        hora,
        user_id: req.user.id
    };
    {/**Se insertan los datos la base de datos en la tabla links */}
    await pool.query('INSERT INTO links set ?', [newLink]);
    {/**Se trae el metodo flash para mostrar un mensaje; la primer propiedad indica el tipo de mensaje y el segundo el mensaje a mostrar en la vista del usuario */}
    req.flash('success', 'Cita agendada');
    {/**Una vez guardada la cita se redirecciona el usuario a la vista links */}
    res.redirect('/links');
});

//Renderiza todos los links guardados por el usuario
router.get('/', isLoggedIn, async (req, res) =>{
    {/**Envia una consulta a la base de datos de acuerdo al id del usuario que tenga la sesión*/}
    const links = await pool.query('SELECT * FROM links WHERE user_id = ?', [req.user.id]);
    res.render('links/list', { links } )
});

//Renderiza todos los links guardados por el usuario
router.get('/listadmin', isLoggedIn, async (req, res) =>{
    {/**Envia una consulta a la base de datos de acuerdo al id del usuario que tenga la sesión*/}
    const links = await pool.query('SELECT * FROM links');
    res.render('links/listadmin', { links } )
});

router.get('/viewusers', isLoggedIn, async (req, res) =>{
    {/**Envia una consulta a la base de datos de acuerdo al id del usuario que tenga la sesión*/}
    const users = await pool.query('SELECT * FROM users WHERE id > 1');
    res.render('links/viewusers', { users } )
});

//A traves de la ruta delete y el id de la cita se elimina la cita de la base de datos
router.get('/delete/:id', isLoggedIn, async (req, res) =>{
    const { id } = req.params;
    //Envia la peticion a la base de datos para elminar la cita
    await pool.query('DELETE FROM links WHERE ID = ?', [id]);
    //Envia un mensaje de correcta eliminacion
    req.flash('success', 'Cita cancelada');
    res.redirect('/links');
})

router.get('/deleteuser/:id', isLoggedIn, async (req, res) =>{
    const { id } = req.params;
    //Envia la peticion a la base de datos para elminar al usuario y citas que tenga agendadas
    await pool.query('DELETE users, links FROM users LEFT JOIN links ON users.id = links.user_id WHERE ID = ?;', [id]);
    //Envia un mensaje de correcta eliminacion
    req.flash('success', 'usuario eliminado');
    res.redirect('/links/viewusers');
})
//A traves de la ruta edit y el id de la cita se envia al usuario, a la vista edit para poder editar o actualizar la cita.
router.get('/edit/:id', isLoggedIn, async (req, res) =>{
    const { id } = req.params;
    //Se hace una consulta a la base de datos para que se muestren los datos de la cita en la vista
    const links = await pool.query('SELECT * FROM links WHERE ID = ?', [id])
    //Se pone en links que del arreglo seleccione el objeto 0, debido a que de la base de datos la informacion llega en forma de un objeto dentro de un arreglo
    res.render('links/edit', {link: links[0]})
})

//Envia los datos editados a la base de datos, actualizandolos en esa misma
router.post('/edit/:id', isLoggedIn, async (req, res) =>{
    {/**Se recibe el id de los parametros */}
    const { id } = req.params;
    {/* Se procesan los datos recibidos a traves de "req.body"*/}
    const { title, fecha, hora } = req.body;
    const newLink = {
        title,
        fecha,
        hora
    };
    {/**Se insertan los datos editados a la base de datos en la tabla links */}
    await pool.query('UPDATE links set ? WHERE id = ?', [newLink, id]);
    //Envia un mensaje de correcta actualizacion
    req.flash('success', 'Cita actualizada');
    {/**Una vez actualizada la cita se redirecciona el usuario a la vista links */}
    res.redirect('/links');
})

module.exports = router;