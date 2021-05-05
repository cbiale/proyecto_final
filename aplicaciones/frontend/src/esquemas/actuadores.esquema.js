import * as yup from 'yup'

const actuadoresEsquema = yup.object().shape({
  descripcion: yup
    .string()
    .required('Debe dar una descripción al tipo de actuador'),
})

export { actuadoresEsquema }
