
//Se trae el modulo moment para formatear la fecha y hora
const moment = require('moment')

//Se crea un objeto para poder utilizar moment desde las vistas
const helpers = {};

//Se formatea la fecha traida de la base de datos para que sea legible para el usuario
helpers.fechaFormateada = (fechaDesdeBD) => {
    return moment(fechaDesdeBD).format("DD/MM/YYYY")
}

//Se formatea la hora traida de la base de datos para que sea legible para el usuario
helpers.horaFormateada = (horaDesdeBD) => {
    const momento = moment(horaDesdeBD, 'HH:mm:ss')
    return momento.format('hh:mm a');
}

module.exports = helpers;
