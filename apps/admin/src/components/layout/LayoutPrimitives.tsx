import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const Container: React.FC<ContainerProps> = ({ children, className = '' }) => {
  return (
    <div className={`mx-auto max-w-7xl px-6 md:px-12 lg:px-16 w-full ${className}`}>
      {children}
    </div>
  );
};

interface SectionProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
}

export const Section: React.FC<SectionProps> = ({ id, children, className = '', dark = false }) => {
  return (
    <section
      id={id}
      className={`py-8 md:py-12 relative overflow-hidden ${
        dark ? 'bg-bg' : 'bg-bg'
      } ${className}`}
    >
      {children}
    </section>
  );
};

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  description?: string;
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  subtitle,
  description,
  className = ''
}) => {
  return (
    <div className={`mb-8 max-w-3xl ${className}`}>
      {subtitle && (
        <span className="text-xs uppercase tracking-[0.2em] text-accent font-medium mb-2 block">
          {subtitle}
        </span>
      )}
      <h2 className="text-3xl font-semibold tracking-tight text-primary leading-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-sm text-secondary leading-relaxed font-light">
          {description}
        </p>
      )}
    </div>
  );
};

interface GridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4 | '1-2' | '2-1';
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Grid: React.FC<GridProps> = ({
  children,
  cols = 3,
  gap = 'lg',
  className = ''
}) => {
  const gapClasses = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8 md:gap-10',
    xl: 'gap-10 md:gap-12'
  };

  const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    '1-2': 'grid-cols-1 md:grid-cols-[1fr_2fr]',
    '2-1': 'grid-cols-1 md:grid-cols-[2fr_1fr]'
  };

  return (
    <div className={`grid ${colClasses[cols]} ${gapClasses[gap]} ${className}`}>
      {children}
    </div>
  );
};

interface StackProps {
  children: React.ReactNode;
  direction?: 'row' | 'col';
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between';
  className?: string;
}

export const Stack: React.FC<StackProps> = ({
  children,
  direction = 'col',
  spacing = 'md',
  align = 'stretch',
  justify = 'start',
  className = ''
}) => {
  const spacingClasses = {
    xs: 'space-y-2 space-x-0',
    sm: 'space-y-4 space-x-0',
    md: 'space-y-6 space-x-0',
    lg: 'space-y-8 md:space-y-10 space-x-0',
    xl: 'space-y-10 md:space-y-12 space-x-0'
  };

  const rowSpacingClasses = {
    xs: 'space-x-2 space-y-0',
    sm: 'space-x-4 space-y-0',
    md: 'space-x-6 space-y-0',
    lg: 'space-x-8 space-y-0',
    xl: 'space-x-10 space-y-0'
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch'
  };

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between'
  };

  return (
    <div
      className={`flex ${
        direction === 'row'
          ? `flex-row ${rowSpacingClasses[spacing]}`
          : `flex-col ${spacingClasses[spacing]}`
      } ${alignClasses[align]} ${justifyClasses[justify]} ${className}`}
    >
      {children}
    </div>
  );
};
