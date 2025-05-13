import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useNotificationStore from '../../stores/NotificationStore';

const Notification = () => {
    const { notification } = useNotificationStore();

    // Анимации для уведомлений
    const notificationVariants = {
        hidden: { opacity: 0, y: -50, x: "-50%" },
        visible: { 
            opacity: 1, 
            y: 0,
            x: "-50%",
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30
            }
        },
        exit: { 
            opacity: 0, 
            y: -50,
            x: "-50%",
            transition: {
                duration: 0.2
            }
        }
    };

    return (
        <AnimatePresence>
            {notification && (
                <motion.div
                    className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 py-2 px-4 rounded-lg shadow-lg ${
                        notification.type === 'success' ? 'bg-green-500 text-white' :
                        notification.type === 'error' ? 'bg-red-500 text-white' :
                        notification.type === 'warning' ? 'bg-yellow-500 text-white' :
                        'bg-blue-500 text-white'
                    }`}
                    variants={notificationVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <div className="flex items-center">
                        {notification.type === 'success' && (
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        )}
                        {notification.type === 'error' && (
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        )}
                        {notification.type === 'warning' && (
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                            </svg>
                        )}
                        {notification.type === 'info' && (
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        )}
                        <span>{notification.message}</span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Notification;
