import { render, screen } from '@testing-library/svelte'
import svelte from 'svelte-inline-compile';

test('Prueba de contenedor con componentes adicionales', () => {

    render(svelte`
    <script>
        import Contenedor from '../src/componentes/Contenedor.svelte'
        import Label from '../src/componentes/Label.svelte'
        import Entrada from '../src/componentes/Entrada.svelte'
        import Boton from '../src/componentes/Boton.svelte'
    </script>

    <Contenedor data-testid = 'contenedor'>
        <Label 
            data-testid='label'
            texto='Usuario'
        />
        <Entrada
            data-testid='entrada'
            id='usuario'
            ayuda='Nombre de usuario'
            type='text'
            value='Claudio'
        />
        <Boton
            data-testid ='boton'
            label='Guardar'
            icono='guardar'
            color='primary'
        />
    </Contenedor>
    `)

    const contenedor = screen.getByTestId('contenedor')
    const label = screen.getByTestId('label')
    const entrada = screen.getByTestId('entrada')
    const boton = screen.getByTestId('boton')

    expect(contenedor).toHaveClass("flex items-center justify-between")
    expect(contenedor).toContainElement(label)
    expect(contenedor).toContainElement(entrada)
    expect(contenedor).toContainElement(boton)
    expect(contenedor).toBeInTheDocument()

    expect(label).toHaveTextContent('Usuario')
    expect(entrada).toHaveValue('Claudio')
    expect(boton).toHaveTextContent('Guardar')
});