const handlebars = require('handlebars')
//Se trae el modulo moment para formatear la fecha y hora
const moment = require('moment')

//Se crea un objeto para poder utilizar moment desde las vistas



//Se formatea la fecha traida de la base de datos para que sea legible para el usuario
handlebars.registerHelper('fechaFormateada', (fechaDesdeBD) => {
    return moment(fechaDesdeBD).format("DD/MM/YYYY")
})

//Se formatea la hora traida de la base de datos para que sea legible para el usuario
handlebars.registerHelper('horaFormateada', (horaDesdeBD) => {
    const momento = moment(horaDesdeBD, 'HH:mm:ss')
    return momento.format('hh:mm a');
})

// handlebars.registerHelper('ifequal', function (a, b, options) {
//     return a === b ? options.fn(this) : options.inverse(this);
//   });

handlebars.registerHelper('ifadmin', function (user, options) {
    // Verifica si el usuario tiene el rol de "admin"
    if (user && user.role === 'admin') {
      return options.fn(this); // El usuario tiene el rol de "admin", ejecuta el bloque if
    } else {
      return options.inverse(this); // El usuario no tiene el rol de "admin", ejecuta el bloque else
    }
  });

module.exports = handlebars.helpers;
