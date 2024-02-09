//Se trae el metodo format del modulo timeago.js
const { format } = require('timeago.js');

//Se crea un objeto para poder utilizar timeago desde las vistas
const helpers = {};

//Cambia la fecha guardada en la base de datos al formato de "timeago" que le indica al usuario de una forma mas intuitiva desde hace cuanto tiempo fue creado el link
helpers.timeago = (timestamp) => {
    return format(timestamp);
}

module.exports = helpers;
