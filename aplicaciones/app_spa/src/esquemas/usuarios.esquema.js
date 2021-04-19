import * as yup from 'yup'

const usuariosEsquemaAgregar = yup.object().shape({
  id: yup.string().trim().required('Debe dar un nombre al usuario'),
  password: yup.string().trim().required('Debe dar una clave al usuario'),
  passwordControl: yup.string().oneOf([yup.ref('password'), null], 'Las claves deben coincidir')
})

const usuariosEsquemaModificar = yup.object().shape({
    password: yup.string().trim().required('Debe dar una clave al usuario'),
    passwordControl: yup.string().trim().oneOf([yup.ref('password'), null], 'Las claves deben coincidir')
})
  
export { usuariosEsquemaAgregar, usuariosEsquemaModificar }

// claves: https://til.hashrocket.com/posts/vahuw4phan-check-the-password-confirmation-with-yup
