import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import FindJobs from "./pages/FindJobs";
import JobDetails from "./pages/JobDetails";
import ApplyJob from "./pages/ApplyJob";
import Applications from "./pages/Applications";
import SavedJobs from "./pages/SavedJobs";
import EmployerDashboard from "./pages/EmployerDashboard";
import CompanyProfile from "./pages/CompanyProfile";
import PostJob from "./pages/PostJob";
import EmployerApplications from "./pages/EmployerApplications";
import Profile from "./pages/Profile";
import ManageJobs from "./pages/ManageJobs";

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
<Route
  path="/employer"
  element={<EmployerDashboard />}
/>
<Route
  path="/employer/company"
  element={<CompanyProfile />}
/>
<Route path="/employer/post-job" element={<PostJob />} />
<Route
  path="/employer/applications"
  element={<EmployerApplications />}
/>
<Route path="/employer/jobs" element={<ManageJobs />} />
<Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;