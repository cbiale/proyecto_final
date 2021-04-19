import * as yup from 'yup'

const reglasEsquema = yup.object().shape({
  descripcion: yup
    .string()
    .trim()
    .required('Debe dar una descripción a la regla'),
  condiciones: yup.object({
    conditions: yup.object({
      all: yup.array().of(
        yup.object().shape({
          fact: yup.string().trim().required('Debe especificar un sensor'),
          operator: yup
            .string()
            .trim()
            .required('Debe especificar un operador'),
          value: yup
            .number()
            .typeError('Debe especificar un valor')
            .required('Debe especificar un valor numérico'),
        }),
      ),
    }),
  }),
  acciones: yup.array().of(
    yup.object().shape({
      actuador: yup.string().trim().required('Debe especificar un actuador'),
      estado: yup.string().trim().required('Debe especificar un estado'),
    }),
  ),
})

export { reglasEsquema }

// claves: https://til.hashrocket.com/posts/vahuw4phan-check-the-password-confirmation-with-yup
