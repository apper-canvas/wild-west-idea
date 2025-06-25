import React from 'react'

const Text = ({ 
  children, 
  variant = 'body', 
  size = 'base',
  color = 'primary',
  className = '',
  as: Component = 'p',
  ...props 
}) => {
  const variants = {
    display: 'font-display font-bold tracking-wide',
    heading: 'font-display font-bold',
    body: 'font-sans',
    caption: 'font-sans text-sm'
  }
  
  const colors = {
    primary: 'text-white',
    secondary: 'text-secondary',
    accent: 'text-accent',
    muted: 'text-surface-300',
    success: 'text-success',
    warning: 'text-warning',
    error: 'text-error'
  }

  const filterProps = (props) => {
    const { variant, size, color, as, ...filteredProps } = props
    return filteredProps
  }

  return (
    <Component
      className={`
        ${variants[variant]}
        text-${size}
        ${colors[color]}
        ${className}
      `}
      {...filterProps(props)}
    >
      {children}
    </Component>
  )
}

export default Text