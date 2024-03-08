// middleware.js
const checkRole = (req, res, next) => {
    console.log('Middleware de verificación de roles ejecutado');
    try {
      // Verificar si el usuario tiene el rol requerido
      if (req.session && req.session.passport && req.session.passport.user) {
        const user = req.session.passport.user;
        // Aquí, user ya contiene la información del usuario, incluido el rol
        console.log(user)
        if (user === 1) {
          next(); // Usuario autorizado
        } else {
          return res.status(403).json({ message: 'No tienes permisos para acceder a esta ruta' });
        }
      } else {
        return res.status(401).json({ message: 'No autenticado' });
      }
    } catch (error) {
      console.error('Error al verificar el rol:', error);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  };
  
  module.exports = { checkRole };