import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
// import RaceControlLogin from "./pages/RaceControlLogin"; // Make sure 'SecurityLogin' is the correct file name
import FrontdeskLogin from "./pages/FrontdeskLogin"; // Make sure 'frontdesklogin' is the correct file name
import FlagBearer from "./pages/FlagBearer";
import RaceFlags from "./pages/race-flags";
import LapLineTracker from "./pages/LapLineTracker";
import LeaderBoard from "./pages/LeaderBoard";
import { SocketProvider } from "./context/SocketContext";
import Racer from "./pages/Racer";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Frontdesk from "./pages/FrontDesk2";
import RaceControl from "./pages/RaceControl";
import RaceCountdown from "./pages/RaceCountdown";

const root = ReactDOM.createRoot(document.getElementById("root"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/race-control",
    element: <RaceControl />,
  },
  {
    path: "/frontdesk",
    element: <Frontdesk />,
  },
  {
    path: "/leader-board",
    element: <LeaderBoard />,
  },
  {
    path: "/race-flags",
    element: <RaceFlags />,
  },
  {
    path: "/lap-line-tracker",
    element: <LapLineTracker />,
  },
  {
    path: "/race-countdown",
    element: <RaceCountdown />,
  },
]);
root.render(
  <React.StrictMode>
    <SocketProvider>
      {" "}
      {/* Provides socket for the whole app */}
      <RouterProvider router={router} />
    </SocketProvider>
  </React.StrictMode>
);
