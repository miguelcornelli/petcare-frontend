import { render, screen } from '@testing-library/react'
import { Input } from '@/components/ui/Input'

describe('Input', () => {
  it('renders label', () => {
    render(<Input label="Nome" />)
    expect(screen.getByLabelText('Nome')).toBeInTheDocument()
  })

  it('shows error message', () => {
    render(<Input label="Email" error="E-mail inválido" />)
    expect(screen.getByRole('alert')).toHaveTextContent('E-mail inválido')
  })

  it('renders without label', () => {
    render(<Input placeholder="Buscar..." />)
    expect(screen.getByPlaceholderText('Buscar...')).toBeInTheDocument()
  })
})
