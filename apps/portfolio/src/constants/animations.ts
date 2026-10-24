import { Variants } from 'framer-motion';
import { theme } from './theme';

const premiumTransition = {
  duration: theme.transitions.duration.slow,
  ease: theme.transitions.easing.premium
};

export const fadeIn: Variants = {
  hidden: {
    opacity: 0,
    filter: 'blur(4px)'
  },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    transition: premiumTransition
  }
};

export const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    filter: 'blur(4px)'
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: premiumTransition
  }
};

export const fadeDown: Variants = {
  hidden: {
    opacity: 0,
    y: -20,
    filter: 'blur(4px)'
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: premiumTransition
  }
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05
    }
  }
};

export const imageReveal: Variants = {
  hidden: {
    scale: 1.02, // Retrained scale as requested (1.02 -> 1.00)
    opacity: 0.8,
    filter: 'blur(4px)'
  },
  visible: {
    scale: 1,
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 1.2, // Slow and smooth reveal
      ease: theme.transitions.easing.premium
    }
  }
};

export const buttonHover = {
  scale: 1.02,
  transition: {
    duration: theme.transitions.duration.fast,
    ease: theme.transitions.easing.premium
  }
};

export const cardHover = {
  y: -4,
  borderColor: 'var(--color-accent-hover)', // Tailwind handles transition
  transition: {
    duration: theme.transitions.duration.medium,
    ease: theme.transitions.easing.premium
  }
};

export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    y: 15,
    filter: 'blur(4px)'
  },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: premiumTransition
  },
  exit: {
    opacity: 0,
    y: -15,
    filter: 'blur(4px)',
    transition: {
      duration: theme.transitions.duration.medium,
      ease: theme.transitions.easing.premium
    }
  }
};
