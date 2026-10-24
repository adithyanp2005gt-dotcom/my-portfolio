import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { buttonHover } from '../../constants/animations';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'link';
  onClick?: () => void;
  to?: string;
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  onClick,
  to,
  href,
  type = 'button',
  disabled = false,
  className = ''
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-sans font-medium text-sm tracking-wider uppercase transition-all duration-300 rounded-[20px] outline-none disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary text-bg px-8 py-3.5 border border-primary hover:bg-transparent hover:text-primary',
    secondary: 'bg-transparent text-primary px-8 py-3.5 border border-neutral-border hover:border-accent hover:text-accent',
    link: 'bg-transparent text-accent p-0 border-none hover:text-primary lowercase tracking-normal normal-case after:content-["_→"] after:inline-block after:transition-transform hover:after:translate-x-1'
  };

  const Component = motion.button;

  const content = (
    <span className="flex items-center gap-2">
      {children}
    </span>
  );

  // Router Link
  if (to && !disabled) {
    return (
      <Link to={to} className={`${baseStyles} ${variants[variant]} ${className}`}>
        {content}
      </Link>
    );
  }

  // External Link
  if (href && !disabled) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseStyles} ${variants[variant]} ${className}`}
      >
        {content}
      </a>
    );
  }

  return (
    <Component
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={variant !== 'link' ? buttonHover : undefined}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {content}
    </Component>
  );
};
