import * as yup from 'yup'

const sensoresEsquema = yup.object().shape({
  descripcion: yup
    .string()
    .required('Debe dar una descripción al tipo de sensor'),
    metrica: yup
    .string()
    .required('Debe dar una métrica al tipo de sensor'),
})

export { sensoresEsquema }
