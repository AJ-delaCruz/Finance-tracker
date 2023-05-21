import { createContext, useState, useEffect } from 'react';
import io from 'socket.io-client';
import { backendUrl } from '../config';

//create new context object for Notification
export const NotificationContext = createContext();

//create the component that provides the shared state to its children components
export const NotificationProvider = ({ children }) => {
    //states that will be shared 
    const [notificationCount, setNotificationCount] = useState(0);
    const [notificationEvents, setNotificationEvents] = useState([]);


    //real time notifications
    useEffect(() => {
        const socket = io(`${backendUrl}`);

        socket.on('notificationEvent', (event) => {
            // Increment the notification count
            setNotificationCount((prevCount) => prevCount + 1);
            // Add the event to the notification events list
            setNotificationEvents((prevEvents) => [...prevEvents, { message: event.message, read: false }]);
            // console.log(notificationCount)
            // console.log(notificationEvents)
        });

        return () => {
            socket.off('notificationEvent');
            // socket.off('connectError');
        };
    }, []);

    const markAsRead = (index) => {
        setNotificationEvents((prevEvents) => {
            const newEvents = [...prevEvents];
            newEvents[index].read = true;
            newEvents.splice(index, 1); // remove the read notification at this index
            return newEvents;
        });

        // update the notification count
        setNotificationCount((prevCount) => (prevCount > 0 ? prevCount - 1 : 0));
    };

    const markAllAsRead = () => {
        setNotificationEvents([]);
        setNotificationCount(0);
    };


    // Wrap the NotificationProvider children with the context provider 
    return (
        <NotificationContext.Provider value={{ notificationCount, notificationEvents, markAsRead, markAllAsRead }}>
            {children}
        </NotificationContext.Provider>
    );
};
