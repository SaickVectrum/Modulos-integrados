const express = require('express');
const router = express.Router();

const passport = require('passport');

//Se traen los metodos para proteger las rutas
const {isLoggedIn, isNotLoggedIn} = require('../lib/auth');

const {checkRole} = require('../lib/role')
//Se trae la conexion a la base de datos
const pool = require('../database');

//Se renderiza el formulario para que el usuario se registre
router.get('/signup', isNotLoggedIn, (req, res) =>{
    res.render('auth/signup');
})

//Se autentifica si el usuario es creado correctamente
router.post('/signup', isNotLoggedIn, passport.authenticate('local.signup', {
    //Si la autenticacion es correcta, envia al usuario a la pagina para agendar citas
    successRedirect: '/profile',
    //De lo contrario deja al usuario en la misma vista de registro
    failureRedirect: '/signup',
    //Permite recibir mensajes flash de exito y de error
    failureFlash: true
}))

//Renderiza la vista de inicio de sesion
router.get('/signin', isNotLoggedIn, (req, res)=> {
    res.render('auth/signin');
})

// //Se autentifica si el usuario esta creado
// router.post('/signin', isNotLoggedIn, (req, res, next) => {
//     passport.authenticate('local.signin',{
//         //Si la autenticacion es correcta, envia al usuario a la pagina para agendar citas
//         successRedirect: '/profile',
//         //De lo contrario deja al usuario en la misma vista de inicio de sesion
//         failureRedirect: '/signin',
//         //Permite recibir mensajes flash de exito y de error
//         failureFlash: true
//     })(req, res, next);
// })

router.post('/signin', passport.authenticate('local.signin', {
    failureRedirect: '/signin', // Redirección en caso de fallo en la autenticación
    failureFlash: true
  }), (req, res) => {
    // Redirigir a la página correspondiente según el rol del usuario
    if (req.user.role === 'admin') {
      res.redirect('/adminprofile');
    } else {
      res.redirect('/profile');
    }
  });

//Renderiza la pagina principal para agendar citas despues de la autenticacion del usuario
router.get('/profile', isLoggedIn, (req, res) =>{
    res.render('profile')
})

router.get('/adminprofile', isLoggedIn,checkRole, (req, res) =>{
    res.render('adminprofile')
})

//Permite al usuario cerrar sesion 
router.get("/logout", isLoggedIn, (req, res, next) => {
    req.logOut(req.user, err => {
        if(err) return next(err);
        //Envia al usuario a signin por si desea volver a iniciar sesion
        res.redirect("/signin");  
    });
});

module.exports = router;