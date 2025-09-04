import "./App.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Layout from "./components/Layout/Layout";
import Home from "./components/Home/Home";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import NotFound from "./components/NotFound";
import Dashboard from "./components/Dashboard/Dashboard";
import Profile from "./components/Profile/Profile";
import CreateApp from "./components/CreateApp/CreateApp";
import Applications from "./components/Applications/Applications";
import Admin from "./components/Admin/Admin";
import AdminDashboard from "./components/AdminDashboard/AdminDashboard";
import ResumeFeedback from "./components/AiServices/ResumeFeedback/ResumeFeedBack";
import JobAnalyzer from "./components/AiServices/JobAnalyzer/JobAnalyzer";
import DashboardInsights from "./components/AiServices/DashboardInsights/DashboardInsights";
import CareerChatbot from "./components/AiServices/CareerChatbot/CareerChatbot";

function App() {
  const theme = createTheme({
    typography: {
      fontFamily: "Roboto, Arial, sans-serif",
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="register" element={<Register />} />
              <Route path="login" element={<Login />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            <Route path="/dashboard" element={<Dashboard />}>
              <Route path="profile" element={<Profile />} />
              <Route path="createapp" element={<CreateApp />} />
              <Route path="applications" element={<Applications />} />

              <Route path="ai/resume-feedback" element={<ResumeFeedback />} />
              <Route path="ai/job-analyze" element={<JobAnalyzer />} />
              <Route
                path="ai/dashboard-insights"
                element={<DashboardInsights />}
              />
              <Route path="ai/chatbot" element={<CareerChatbot />} />
            </Route>
            <Route path="admindashboard" element={<AdminDashboard />}>
              <Route path="admin" element={<Admin />} />
            </Route>
          </Routes>
        </HashRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
