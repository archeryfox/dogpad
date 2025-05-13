// src/pages/EventFeed.jsx
import { useEffect, useState, useMemo } from 'react';
import useEventStore from '../stores/EventStore';
import useSubscriptionStore from '../stores/SubscriptionStore';
import EventCard from '../components/cards/EventCard.jsx';
import useAuthStore from '../stores/AuthStore';
import CategoryList from '../components/CategoryList';
import { motion, AnimatePresence } from 'framer-motion';

const EventFeed = () => {
    const { events, fetchEvents } = useEventStore();
    const { user } = useAuthStore();
    const { subscriptions, fetchSubscriptions, addSubscription, addPaidSubscription, deleteSubscription } = useSubscriptionStore();
    
    // Состояния
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('date');
    const [notification, setNotification] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    
    // Состояния для пагинации
    const [currentPage, setCurrentPage] = useState(1);
    const [eventsPerPage, setEventsPerPage] = useState(9);
    const [totalPages, setTotalPages] = useState(1);

    // Загружаем мероприятия и подписки при монтировании компонента
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            await Promise.all([fetchEvents(), fetchSubscriptions()]);
            setIsLoading(false);
        };
        
        loadData();
    }, []);

    // Фильтрация и сортировка мероприятий
    useEffect(() => {
        if (!events) return;
        
        let filtered = [...events];

        if (selectedCategory) {
            filtered = filtered.filter(event =>
                event.categories?.some(cat => cat.category.id === selectedCategory)
            );
        }

        if (searchQuery) {
            filtered = filtered.filter(event =>
                event.name?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Сортировка мероприятий
        if (sortBy === 'date') {
            filtered = filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (sortBy === 'name') {
            filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === 'price') {
            filtered = filtered.sort((a, b) => {
                // Сначала бесплатные, потом по возрастанию цены
                if (!a.isPaid && b.isPaid) return -1;
                if (a.isPaid && !b.isPaid) return 1;
                if (a.isPaid && b.isPaid) return a.price - b.price;
                return 0;
            });
        }

        setFilteredEvents(filtered);
        setTotalPages(Math.ceil(filtered.length / eventsPerPage));
        
        // Сбрасываем текущую страницу на первую при изменении фильтров
        setCurrentPage(1);
    }, [events, selectedCategory, searchQuery, sortBy, eventsPerPage]);

    // Получаем текущие мероприятия для отображения на странице
    const currentEvents = useMemo(() => {
        const indexOfLastEvent = currentPage * eventsPerPage;
        const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
        return filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
    }, [filteredEvents, currentPage, eventsPerPage]);

    // Функция отображения уведомлений
    const showNotification = (message, type = 'info') => {
        setNotification({ message, type });
        
        // Автоматически скрываем уведомление через 3 секунды
        setTimeout(() => {
            setNotification(null);
        }, 3000);
    };

    // Функция фильтрации мероприятий по категории
    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId);
    };

    // Функция для обработки изменения поискового запроса
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Функция для обработки изменения параметра сортировки
    const handleSortChange = (e) => {
        setSortBy(e.target.value);
    };

    // Функция для изменения количества мероприятий на странице
    const handleEventsPerPageChange = (e) => {
        setEventsPerPage(Number(e.target.value));
    };

    // Функция для перехода на определенную страницу
    const goToPage = (pageNumber) => {
        setCurrentPage(pageNumber);
        // Прокрутка вверх страницы при смене страницы
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Функция для подписки на мероприятие
    const handleSubscribe = async (eventId) => {
        if (!user) {
            showNotification("Пожалуйста, войдите в систему для подписки!", "warning");
            return;
        }
        
        // Находим мероприятие по ID
        const event = events.find(e => e.id === eventId);
        if (!event) {
            showNotification("Мероприятие не найдено", "error");
            return;
        }
        
        try {
            console.log("Подписка на мероприятие:", event);
            
            // Если мероприятие платное, используем метод для платных подписок
            if (event.isPaid && event.price > 0) {
                console.log("Платное мероприятие, цена:", event.price);
                const success = await addPaidSubscription(eventId, user.id, event.price);
                if (success) {
                    showNotification(`Вы успешно подписались на "${event.name}"`, "success");
                }
            } else {
                // Для бесплатных мероприятий используем обычный метод подписки
                addSubscription({ eventId: eventId, userId: user.id });
                showNotification(`Вы успешно подписались на "${event.name}"`, "success");
            }
        } catch (error) {
            console.error("Ошибка при подписке:", error);
            showNotification(`Ошибка при подписке: ${error.message || 'Неизвестная ошибка'}`, "error");
        }
    };

    // Функция для отписки от мероприятия
    const handleDeleteSubscription = (eventId) => {
        const subscriptionToDelete = subscriptions.find(sub => sub.eventId === eventId && sub.userId === user?.id);
        
        if (subscriptionToDelete) {
            try {
                deleteSubscription(subscriptionToDelete.id);
                const eventName = events.find(e => e.id === eventId)?.name || "мероприятие";
                showNotification(`Вы отписались от "${eventName}"`, "info");
            } catch (error) {
                showNotification(`Ошибка при отписке: ${error.message}`, "error");
            }
        }
    };

    // Компонент пагинации
    const Pagination = () => {
        // Если всего одна страница, не показываем пагинацию
        if (totalPages <= 1) return null;
        
        const pageNumbers = [];
        
        // Определяем, какие номера страниц показывать
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);
        
        // Корректируем startPage, если endPage достиг максимума
        if (endPage === totalPages) {
            startPage = Math.max(1, endPage - 4);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }
        
        return (
            <div className="flex justify-center mt-8">
                <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    {/* Кнопка "Предыдущая" */}
                    <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border ${
                            currentPage === 1 
                                ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed' 
                                : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                        }`}
                    >
                        <span className="sr-only">Предыдущая</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>
                    
                    {/* Кнопка "Первая страница", если текущая страница > 3 */}
                    {startPage > 1 && (
                        <>
                            <button
                                onClick={() => goToPage(1)}
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                1
                            </button>
                            {startPage > 2 && (
                                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                    ...
                                </span>
                            )}
                        </>
                    )}
                    
                    {/* Номера страниц */}
                    {pageNumbers.map(number => (
                        <button
                            key={number}
                            onClick={() => goToPage(number)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                currentPage === number
                                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                        >
                            {number}
                        </button>
                    ))}
                    
                    {/* Кнопка "Последняя страница", если не показываем последнюю страницу */}
                    {endPage < totalPages && (
                        <>
                            {endPage < totalPages - 1 && (
                                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                    ...
                                </span>
                            )}
                            <button
                                onClick={() => goToPage(totalPages)}
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                {totalPages}
                            </button>
                        </>
                    )}
                    
                    {/* Кнопка "Следующая" */}
                    <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border ${
                            currentPage === totalPages 
                                ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed' 
                                : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                        }`}
                    >
                        <span className="sr-only">Следующая</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>
                </nav>
            </div>
        );
    };

    // Анимации для карточек событий
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    // Анимации для уведомлений
    const notificationVariants = {
        hidden: { opacity: 0, y: -50, x: "-50%" },
        visible: { 
            opacity: 1, 
            y: 0,
            x: "-50%",
            transition: {
                type: "spring",
                stiffness: 500,
                damping: 25
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
        <div className="event-feed-container max-w-6xl mx-auto px-4 py-8">
            <motion.h2 
                className="text-3xl font-bold text-center mb-8 text-gray-800"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                Лента мероприятий
            </motion.h2>

            {/* Поиск и фильтры */}
            <motion.div 
                className="bg-white p-4 rounded-xl shadow-md mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                {/* Поле поиска */}
                <div className="mb-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Поиск по названию"
                            className="p-3 pl-10 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                        <div className="absolute left-3 top-3 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Фильтры и сортировка */}
                <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex-grow">
                        <CategoryList onCategoryChange={handleCategoryChange} />
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        {/* Выбор сортировки */}
                        <div className="flex items-center">
                            <label htmlFor="sort-by" className="mr-2 text-gray-600 whitespace-nowrap">Сортировать по:</label>
                            <select
                                id="sort-by"
                                className="p-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={sortBy}
                                onChange={handleSortChange}
                            >
                                <option value="date">По дате</option>
                                <option value="name">По названию</option>
                                <option value="price">По цене</option>
                            </select>
                        </div>
                        
                        {/* Выбор количества элементов на странице */}
                        <div className="flex items-center">
                            <label htmlFor="per-page" className="mr-2 text-gray-600 whitespace-nowrap">Показывать по:</label>
                            <select
                                id="per-page"
                                className="p-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={eventsPerPage}
                                onChange={handleEventsPerPageChange}
                            >
                                <option value={6}>6</option>
                                <option value={9}>9</option>
                                <option value={12}>12</option>
                                <option value={24}>24</option>
                            </select>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Индикатор загрузки */}
            {isLoading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <>
                    {/* Информация о результатах поиска */}
                    <div className="text-gray-600 mb-4">
                        {filteredEvents.length > 0 ? (
                            <p>
                                Показано {Math.min((currentPage - 1) * eventsPerPage + 1, filteredEvents.length)}-
                                {Math.min(currentPage * eventsPerPage, filteredEvents.length)} из {filteredEvents.length} мероприятий
                            </p>
                        ) : null}
                    </div>
                    
                    {/* Результаты поиска */}
                    {filteredEvents.length > 0 ? (
                        <>
                            <motion.div 
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                {currentEvents.map((event) => {
                                    const isSubscribed = subscriptions.some(sub => sub.eventId === event.id && sub.userId === user?.id);
                                    return (
                                        <EventCard
                                            key={event.id}
                                            event={event}
                                            user={user}
                                            isSubscribed={isSubscribed}
                                            onSubscribe={handleSubscribe}
                                            onUnsubscribe={handleDeleteSubscription}
                                        />
                                    );
                                })}
                            </motion.div>
                            
                            {/* Пагинация */}
                            <Pagination />
                        </>
                    ) : (
                        <motion.div 
                            className="text-center py-12 text-gray-500"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="text-xl font-medium mb-2">Мероприятия не найдены</h3>
                            <p>Попробуйте изменить параметры поиска или фильтры</p>
                        </motion.div>
                    )}
                </>
            )}

            {/* Уведомления */}
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
        </div>
    );
};

export default EventFeed;
