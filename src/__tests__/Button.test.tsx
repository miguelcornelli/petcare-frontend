import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/ui/Button'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Clique aqui</Button>)
    expect(screen.getByRole('button', { name: 'Clique aqui' })).toBeInTheDocument()
  })

  it('shows spinner when loading', () => {
    render(<Button loading>Salvar</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('calls onClick when clicked', () => {
    const fn = jest.fn()
    render(<Button onClick={fn}>OK</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('applies danger variant class', () => {
    render(<Button variant="danger">Deletar</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-red-500')
  })
})
