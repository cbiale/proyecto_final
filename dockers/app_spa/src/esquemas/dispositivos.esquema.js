import * as yup from 'yup'

const dispositivosEsquema = yup.object().shape({
  denominacion: yup
    .string()
    .required('Debe dar una denominación al dispositivo'),
  latitud: yup
    .number()
    .typeError('Debe especificar un valor numérico')
    .max(90, 'Valor máximo de 90')
    .min(-90, 'Valor mínimo de -90')
    .required('Debe especificar la latitud donde se encuentra el dispositivo'),
  longitud: yup
    .number()
    .typeError('Debe especificar un valor numérico')
    .max(180, 'Valor máximo de 180')
    .min(-180, 'Valor mínimo de -180')
    .required('Debe especificar la longitud donde se encuentra el dispositivo'),
})

export { dispositivosEsquema }

// The numbers are in decimal degrees format and range from
// -90 to 90 for latitude and
// -180 to 180 for longitud
