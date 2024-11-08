import axios from "axios";

// // The base URL for API requests
const API_URL = import.meta.env.VITE_API_URL;

// Create an instance of axios with the base URL of the API
export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const routes = {
    users: "/users",
    categories: "/categories",
    eventCategories: "/event-categories",
    events: "/events",
    eventSpeakers: "/event-speakers",
    roles: "/roles",
    speakers: "/speakers",
    subscriptions: "/subscriptions",
    transactions: "/transactions",
    venues: "/venues",
    login: "/auth/login",
    register: "/auth/register"
}
