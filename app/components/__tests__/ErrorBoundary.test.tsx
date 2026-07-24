import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ErrorBoundary } from '../ErrorBoundary'

describe('ErrorBoundary', () => {
  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary componentName="TestComp">
        <div>Safe Content</div>
      </ErrorBoundary>
    )
    expect(screen.getByText('Safe Content')).toBeDefined()
  })

  it('renders fallback UI when an error occurs', () => {
    // Suppress console.error for expected test error
    vi.spyOn(console, 'error').mockImplementation(() => {})
    
    const ThrowError = () => {
      throw new Error('Test Error')
    }

    render(
      <ErrorBoundary componentName="TestComp">
        <ThrowError />
      </ErrorBoundary>
    )

    expect(screen.getByText(/We encountered an error while rendering TestComp/i)).toBeDefined()
    expect(screen.getByText(/Something went wrong/i)).toBeDefined()
  })
})
