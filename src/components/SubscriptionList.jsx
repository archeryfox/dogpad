import React, { useEffect } from 'react';
import useSubscriptionsStore from '../stores/SubscriptionStore';
import { format } from 'date-fns';

const SubscriptionList = () => {
    const { subscriptions, fetchSubscriptions } = useSubscriptionsStore();

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Мои подписки</h2>
            <ul className="space-y-6">
                {subscriptions.map(subscription => (
                    <li key={subscription.id} className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
                        <p className="text-lg font-semibold text-blue-600 mb-2">Мероприятие: {subscription.event.name}</p>
                        <p className="text-gray-600">Дата: {format(new Date(subscription.event.date), 'dd.MM.yyyy HH:mm')}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SubscriptionList;
