import React from 'react'
import ApperIcon from '@/components/ApperIcon'

const Input = ({ 
  label,
  icon,
  error,
  type = 'text',
  className = '',
  ...props 
}) => {
  const filterProps = (props) => {
    const { label, icon, error, ...filteredProps } = props
    return filteredProps
  }

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-secondary">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <ApperIcon name={icon} className="w-5 h-5 text-surface-400" />
          </div>
        )}
        
        <input
          type={type}
          className={`
            w-full
            px-4 py-3
            ${icon ? 'pl-12' : ''}
            bg-surface-800
            border-2 border-surface-600
            rounded
            text-white
            placeholder-surface-400
            focus:border-accent
            focus:outline-none
            focus:ring-2
            focus:ring-accent/20
            transition-colors
            wood-texture
            ${error ? 'border-error' : ''}
            ${className}
          `}
          {...filterProps(props)}
        />
      </div>
      
      {error && (
        <p className="text-sm text-error flex items-center gap-1">
          <ApperIcon name="AlertCircle" className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  )
}

export default Input