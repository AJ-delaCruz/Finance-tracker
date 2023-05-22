import {
    createBrowserRouter,
    RouterProvider,
    Outlet,
    Navigate
} from "react-router-dom";

import { useContext } from "react";


import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import Home from './pages/Home/Home';
import Navbar from "./components/navbar/Navbar";
import LeftBar from "./components/leftBar/LeftBar";
import Footer from "./components/footer/Footer";
import Goal from "./components/goal/Goal";
import Transaction from "./components/transaction/Transaction";
import Budget from "./components/budget/Budget";
import Settings from "./components/settings/Settings";
import Bill from "./components/bill/Bill";
import { AuthContext } from "./contextApi/AuthContext";
import Chatbot from "./components/chatbot/Chatbot";

const App = () => {
    // const currentUser = localStorage.getItem('username');

    const { currentUser } = useContext(AuthContext) //access the shared state
    // console.log("first load " + loading);

    // if (loading) {
    //     return <div>Loading...</div>; // Display a loading indicator while waiting
    // }
    const Layout = () => {
        return (

            <div>
                <Navbar />
                <div style={{ display: "flex" }}>
                    <LeftBar />

                    {/* 1/3 space for leftbar and 2/3 space for outlet */}
                    <div style={{ flex: 6 }}>
                        {/* nested routes inside root route */}
                        <Outlet />
                        <Footer />
                    </div>
                </div>
                <Chatbot />
                {/* <Footer /> */}

            </div>

        );
    };

    const ProtectedRoute = ({ children }) => {
        // if (loading) {
        //     return <div>Loading...</div>; // Display a loading indicator while waiting
        // }
        // console.log('loading :' + loading)


        // console.log('AUTH: ' + currentUser);
        // console.log(currentUser);
        if (!currentUser) {
            console.log('Not CURRENT USER: ' + currentUser);
            return <Navigate to="/login" />;
        }

        return children;
    }

    //define the routes
    const router = createBrowserRouter([
        {
            //root route
            path: "/",
            element: (
                <ProtectedRoute>
                    <Layout />
                </ProtectedRoute>
            ),
            //nested routes
            children: [
                {
                    path: "/",
                    element: <Home />,
                },
                {
                    path: "/transaction",
                    element: <Transaction />,
                },
                {
                    path: "/bill",
                    element: <Bill />,
                },
                {
                    path: "/budget",
                    element: <Budget />,
                },
                {
                    path: "/goal",
                    element: <Goal />,
                },
                {
                    path: "/settings",
                    element: <Settings />,
                },
            ],
        },
        {
            path: "/login",
            element: <Login />,
        },
        {
            path: "/register",
            element: <Register />,
        },
    ]);

    return (
        <div className="App">

            <RouterProvider router={router} />

        </div>
    );
}

export default App;
