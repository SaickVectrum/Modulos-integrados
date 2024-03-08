//Se trae el modulo passport para una mejor autenticacion y registro de los usuarios.
const passport = require('passport');
//Se requiere el metodo 'passport-local' para poder autenticar los usuarios de forma manual
const LocalStrategy = require('passport-local').Strategy;

//Se trae la conexion a la base de datos
const pool = require('../database');
//Se traen los metodos de la encriptacion de la contraseña
const helpers = require('./helpers');

//Inicio de Sesion
passport.use('local.signin', new LocalStrategy({
    //Se coloca lo que se va a recibir del formulario
    usernameField: 'username',
    passwordField: 'password',
    //Este se pone para recibir los demas datos
    passReqToCallback: true
}, async(req, username, password, done)=>{
    //Consulta si existe el usuario a traves de username a la base de datos
    const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    //Si indica que tiene varias filas "rows", quiere decir que encontro un usuario
    if(rows.length > 0) {
        //Se guarda el usuario encontrado en una constante
        const user = rows[0];
        //Se comparan las contraseñas para validar el usuario
        const validPassword = await helpers.matchPassword(password, user.password);
        if (validPassword){
            // Asegurémonos de que req.session.passport esté definido antes de asignar propiedades
        req.session.passport = req.session.passport || {};
        req.session.passport.user = {
          id: user.id,
          username: user.username,
          role: user.role || 'regular' // Asignamos el rol del usuario o 'regular' por defecto
        };
            //Si es correcta la contraseña permite entrar al usuario
            done(null, user, req.flash('success','Welcome ' + user.username))
            console.log(req.session);
        } else {
            //De lo contrario le indica que la contraseña esta incorrecta
            done(null, false, req.flash('message','Contraseña Incorrecta'))
        }
    }else {
        //Si no se encuentra un usuario a traves del username, se le indica al usuario que no existe dicho username
        return done(null, false, req.flash('message','El usuario no existe'));
    }
}));

// Función para validar la contraseña
function validatePassword(password) {
    const regexLength = /^.{8,}$/;
    const regexUppercase = /[A-Z]/;
    const regexLowercase = /[a-z]/;
    const regexDigit = /\d/;
    const regexSpecialChar = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/;

    return regexLength.test(password) &&
        regexUppercase.test(password) &&
        regexLowercase.test(password) &&
        regexDigit.test(password) &&
        regexSpecialChar.test(password);
}

//Registro
passport.use('local.signup', new LocalStrategy({
    //Se coloca lo que se va a recibir del formulario
    usernameField: 'username', 
    passwordField: 'password',
    //Este se pone para recibir los demas datos
    passReqToCallback: true

}, async(req, username, password, done) => {
    //Se trae los otros datos que se encuentran en el body a traves de "req"
    const {fullname, phone} = req.body;
    
    // Verificar si es el primer usuario y asignar el rol de administrador
    const adminCount = await pool.query('SELECT COUNT(*) AS count FROM users WHERE role = "admin"');
    const isAdmin = adminCount[0].count === 0;

    const isPasswordSecure = validatePassword(password);
    if (!isPasswordSecure) {
        return done(null, false, req.flash('message', 'La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y caracteres especiales.'));
    }


    //Se almacenan los datos recibidos
    const newUser = {
        username,
        password,
        fullname, 
        phone,
        role: isAdmin ? 'admin' : 'regular' // Asignar el rol de administrador si es el primero, de lo contrario, usar el rol proporcionado en el formulario o asignar 'regular' por defecto.
    };
    //Se encripta la contraseña antes de ser enviada a la base de datos
    newUser.password = await helpers.encryptPassword(password);
    //Se hace la inserccion de los datos a la tabla users de la base de datos
    const result = await pool.query('INSERT INTO users SET ?', [newUser]);
    //Se le agrega el id al usuario
    newUser.id = result.insertId; 
    //Se ejecuta done para continuar, se utiliza null por si hay un error y newUser para crear o generar la sesion
    return done(null, newUser)
}));

//serializeUser se utiliza para guardar el usuario dentro de la sesion
passport.serializeUser((user, done) =>{
    //El id permite guardar el usuario en la sesion
    done(null, user.id);
})

//Se deserializa para poder obtener los datos del usario
passport.deserializeUser(async(id, done) =>{
    //Se traen los datos del usuario de la base de datos
    const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    //Se pone que traiga el primer objeto, ya que los datos vienen en un arreglo
    done(null, rows[0]);
})

