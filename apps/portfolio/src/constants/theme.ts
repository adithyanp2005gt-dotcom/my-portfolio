export const theme = {
  colors: {
    bg: '#090909',
    surface: '#141414',
    border: '#252525',
    textPrimary: '#F5F5F5',
    textSecondary: '#9A9A9A',
    accent: '#4F8CFF',
    success: '#3DDC84'
  },
  typography: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    sizes: {
      xs: '0.75rem',     // 12px
      sm: '0.875rem',    // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',    // 18px
      xl: '1.25rem',     // 20px
      '2xl': '1.5rem',   // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
      '6xl': '3.75rem',  // 60px
      '7xl': '4.5rem',   // 72px
      '8xl': '6rem',     // 96px
    },
    weights: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    }
  },
  borderRadius: {
    none: '0',
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '20px', // Strict border radius requested (20px)
    full: '9999px'
  },
  spacing: {
    xs: '0.5rem',   // 8px
    sm: '1rem',     // 16px
    md: '1.5rem',   // 24px
    lg: '2.5rem',   // 40px
    xl: '4rem',     // 64px
    '2xl': '6rem',   // 96px
    '3xl': '10rem',  // 160px
  },
  shadows: {
    premium: '0 4px 30px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
    cardHover: '0 10px 40px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
  },
  transitions: {
    duration: {
      slow: 0.8, // Slow animations requested
      medium: 0.4,
      fast: 0.2
    },
    easing: {
      premium: [0.22, 1, 0.36, 1], // [x1, y1, x2, y2] for cubic-bezier(.22,1,.36,1)
      premiumString: 'cubic-bezier(.22, 1, .36, 1)'
    }
  },
  zIndex: {
    bg: -10,
    base: 1,
    navbar: 50,
    scrollProgress: 60,
    loader: 100
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px'
  }
} as const;
