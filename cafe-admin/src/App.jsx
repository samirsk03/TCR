import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PendingOrders from "./pages/PendingOrders";
import ActiveSessions from "./pages/ActiveSessions";
import History from "./pages/History";
import Menu from "./pages/Menu";
import SessionDetails from "./pages/SessionDetails";
import Offers from "./pages/Offer";
import SettingsPage from "./pages/Setting";
import DashboardLayout from "./layouts/DashboardLayout";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Dashboard Layout */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />

          <Route
            path="pending-orders"
            element={<PendingOrders />}
          />

          <Route
            path="menu"
            element={<Menu />}
          />

          
          <Route path="offers" element={<Offers />} />
          <Route path="history" element={<History />} />

          <Route
            path="active-sessions"
            element={<ActiveSessions />}
          />

          <Route
            path="active-sessions/:id"
            element={<SessionDetails />}
          />

          <Route
            path="history"
            element={<History />}
          />
          <Route
            path="settings"
            element={<SettingsPage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;