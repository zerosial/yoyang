import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import LoginPage from "./components/Auth/LoginPage";
import TodayScheduleList from "./components/Schedule/TodayScheduleList";
import CareNoteForm from "./components/CareNote/CareNoteForm";
import NotificationList from "./components/Notification/NotificationList";
import LocationHistory from "./components/Location/LocationHistory";
import AdminPage from "./components/Admin/AdminPage";
import AdminAuthPage from "./components/Admin/AdminAuthPage";
import AdminAuthGuard from "./components/Admin/AdminAuthGuard";

function App() {
  const user = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* 관리자 인증/로그인 라우트는 항상 접근 가능 */}
        <Route path="/admin-login" element={<AdminAuthPage />} />
        <Route
          path="/admin"
          element={
            <AdminAuthGuard>
              <AdminPage />
            </AdminAuthGuard>
          }
        />

        {/* 일반 유저용 라우트는 로그인 필요 */}
        {!user ? (
          <Route path="*" element={<LoginPage />} />
        ) : (
          <>
            <Route path="/" element={<TodayScheduleList />} />
            <Route path="/care-note/:scheduleId" element={<CareNoteForm />} />
            <Route path="/notifications" element={<NotificationList />} />
            <Route path="/location" element={<LocationHistory />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
