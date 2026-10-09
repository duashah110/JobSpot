import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import FindJobs from "./pages/FindJobs";
import JobDetails from "./pages/JobDetails";
import ApplyJob from "./pages/ApplyJob";
import Applications from "./pages/Applications";
import SavedJobs from "./pages/SavedJobs";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Navigate to="/login" />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/find-jobs"
          element={<FindJobs />}
        />
        <Route
  path="/jobs/:id"
  element={<JobDetails />}
/>
<Route
  path="/jobs/:id/apply"
  element={<ApplyJob />}
/>
<Route
  path="/applications"
  element={<Applications />}
/>
<Route path="/saved-jobs" element={<SavedJobs />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;