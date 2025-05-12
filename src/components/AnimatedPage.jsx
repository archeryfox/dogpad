import React from 'react';
import { motion } from 'framer-motion';
import PageTransition, { pageTransitions } from './PageTransitions';

// Компонент-обертка для анимации страниц
const AnimatedPage = ({ children, transitionType }) => {
  return (
    <PageTransition transitionType={transitionType}>
      {children}
    </PageTransition>
  );
};

export default AnimatedPage;
