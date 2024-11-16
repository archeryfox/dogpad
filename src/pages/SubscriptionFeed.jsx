import useAuthStore from "../stores/AuthStore.js";
import useSubscriptionStore from "../stores/SubscriptionStore.js";
import useEventStore from "../stores/EventStore.js";
import { useEffect } from "react";
import EventCard from "../components/cards/EventCard.jsx";
// SubscriptionFeed.jsx
export const SubscriptionFeed = ({inProfile}) => {
    const { user } = useAuthStore();
    const { subscriptions, fetchSubscriptions, deleteSubscription } = useSubscriptionStore();
    const { events, fetchEvents } = useEventStore();

    useEffect(() => {
        fetchEvents();
        fetchSubscriptions();
    }, []);

    const isSubscribed = (eventId) => {
        return subscriptions.some(sub => sub.eventId === eventId && sub.userId === user?.id);
    };

    const handleDeleteSubscription = (eventId) => {
        const subscriptionToDelete = subscriptions.find(sub => sub.eventId === eventId && sub.userId === user?.id);
        if (subscriptionToDelete) {
            deleteSubscription(subscriptionToDelete.id);
        }
    };

    return (
        <div className="subscription-feed-container">
            <h2 className="text-3xl font-bold text-center">Ваши подписки</h2>
            <div className="event-list mt-8 space-y-6">
                {events?.map((event) => {
                    return (
                        isSubscribed(event.id) && (
                            <EventCard
                                inProfileFeed={true}
                                key={event.id}
                                event={event}
                                user={user}
                                isSubscribed={true}
                                onSubscribe={() => {}}
                                onUnsubscribe={handleDeleteSubscription}  // передаем handleDeleteSubscription
                            />
                        )
                    );
                })}
            </div>
        </div>
    );
};


export default SubscriptionFeed;
