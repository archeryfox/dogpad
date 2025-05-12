import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Modal = ({ isOpen, onClose, title, message, type = 'info' }) => {
  // Если модальное окно закрыто, не рендерим ничего
  if (!isOpen) return null;

  // Варианты анимации для модального окна
  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    },
    exit: { 
      opacity: 0, 
      y: 50, 
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  // Варианты анимации для фона
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  // Определяем цвет в зависимости от типа сообщения
  let colorClass = 'bg-blue-500';
  let iconElement = <span className="text-2xl">ℹ️</span>;

  if (type === 'success') {
    colorClass = 'bg-green-500';
    iconElement = <span className="text-2xl">✅</span>;
  } else if (type === 'error') {
    colorClass = 'bg-red-500';
    iconElement = <span className="text-2xl">❌</span>;
  } else if (type === 'warning') {
    colorClass = 'bg-yellow-500';
    iconElement = <span className="text-2xl">⚠️</span>;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Затемненный фон */}
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />
          
          {/* Модальное окно */}
          <motion.div 
            className="bg-white rounded-lg shadow-xl z-10 max-w-md w-full mx-4 overflow-hidden"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Заголовок */}
            <div className={`${colorClass} px-4 py-3 flex items-center`}>
              <div className="mr-3">
                {iconElement}
              </div>
              <h3 className="text-white font-bold text-lg">{title}</h3>
            </div>
            
            {/* Содержимое */}
            <div className="p-6">
              <p className="text-gray-700">{message}</p>
            </div>
            
            {/* Кнопка закрытия */}
            <div className="px-6 py-3 bg-gray-100 flex justify-end">
              <motion.button 
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
              >
                Закрыть
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
