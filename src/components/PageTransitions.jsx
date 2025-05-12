import { motion } from 'framer-motion';

// Различные варианты анимаций переходов между страницами
export const pageTransitions = {
  // Стандартный переход слева направо
  slideRight: {
    variants: {
      initial: { opacity: 0, x: -200 },
      in: { opacity: 1, x: 0 },
      out: { opacity: 0, x: 200 }
    },
    transition: {
      type: "tween",
      ease: "anticipate",
      duration: 0.5
    }
  },
  
  // Переход снизу вверх
  slideUp: {
    variants: {
      initial: { opacity: 0, y: 100 },
      in: { opacity: 1, y: 0 },
      out: { opacity: 0, y: -100 }
    },
    transition: {
      type: "tween",
      ease: "easeInOut",
      duration: 0.5
    }
  },
  
  // Переход с масштабированием
  scale: {
    variants: {
      initial: { opacity: 0, scale: 0.8 },
      in: { opacity: 1, scale: 1 },
      out: { opacity: 0, scale: 1.2 }
    },
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  },
  
  // Переход с вращением и масштабированием
  rotate: {
    variants: {
      initial: { opacity: 0, scale: 0.8, rotate: -10 },
      in: { opacity: 1, scale: 1, rotate: 0 },
      out: { opacity: 0, scale: 0.8, rotate: 10 }
    },
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  },
  
  // Переход с затуханием
  fade: {
    variants: {
      initial: { opacity: 0 },
      in: { opacity: 1 },
      out: { opacity: 0 }
    },
    transition: {
      duration: 0.4
    }
  }
};

// Компонент для анимированной страницы с выбором типа анимации
const PageTransition = ({ children, transitionType = "slideRight" }) => {
  const selectedTransition = pageTransitions[transitionType] || pageTransitions.slideRight;
  
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={selectedTransition.variants}
      transition={selectedTransition.transition}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
