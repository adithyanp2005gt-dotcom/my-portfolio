import { Variants } from 'framer-motion';

const premiumTransition = {
  duration: 0.6,
  ease: "easeInOut" as const
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
    y: 15,
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
      staggerChildren: 0.08,
      delayChildren: 0.03
    }
  }
};
