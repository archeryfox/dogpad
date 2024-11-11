// Определите маршруты
import LoginForm from "./components/forms/LoginForm.jsx";
import RegisterForm from "./components/forms/RegisterForm.jsx";
import Profile from "./pages/Profile.jsx";
import EventList from "./components/EventList.jsx";
import CategoryList from "./components/CategoryList.jsx";
import SubscriptionList from "./components/SubscriptionList.jsx";
import TransactionList from "./components/TransactionList.jsx";
import UserList from "./components/UserList.jsx";
import RoleList from "./components/RoleList.jsx";
import VenueList from "./components/VenueList.jsx";
import VenueEventChart from "./components/VenueEventChart.jsx";
import EventChart from "./components/EventChart.jsx";

export const routes = [
    {
        path: "/",
        element: <LoginForm/>,
    },
    {
        path: "/register",
        element: <RegisterForm/>,
    },
    {
        path: "/profile",
        element: <Profile/>,
    },
    {
        path: "/events",
        element: <EventList/>,
    },
    {
        path: "/categories",
        element: <CategoryList/>,
    },
    {
        path: "/subscriptions",
        element: <SubscriptionList/>,
    },
    {
        path: "/transactions",
        element: <TransactionList/>,
    },
    {
        path: "/users",
        element: <UserList/>,
    },
    {
        path: "/roles",
        element: <RoleList/>,
    },
    {
        path: "/venues",
        element: <VenueList/>,
    },
    {
        path: "/venue-events",
        element: <VenueEventChart/>,
    },
    {
        path: "/event-chart",
        element: <EventChart/>,
    },
];