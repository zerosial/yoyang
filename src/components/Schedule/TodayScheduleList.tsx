import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../hooks/useAuth";
import type { User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

// AttendanceRecord 타입 정의 (간단 버전)
type AttendanceRecord = {
  id: string;
  worker_id: string;
  schedule_id: string;
  type: string; // "출근" | "퇴근"
  checked_at: string; // date, time → checked_at으로 통일
};

function TodayScheduleList() {
  const user = useAuth() as User | null;
  const [userName, setUserName] = useState<string>("");
  const [schedules, setSchedules] = useState<Record<string, unknown>[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [attLoading, setAttLoading] = useState(false);
  const [geoError, setGeoError] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    supabase
      .from("users")
      .select("name")
      .eq("id", user.id)
      .single()
      .then(({ data }) => setUserName(data?.name ?? ""));
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const today = new Date().toISOString().slice(0, 10);
    supabase
      .from("schedules")
      .select("*")
      .eq("worker_id", user.id)
      .eq("scheduled_date", today)
      .then(({ data }) => {
        setSchedules(data ?? []);
        setLoading(false);
      });
    // 출근/퇴근 기록도 불러오기 (checked_at의 날짜로 필터)
    supabase
      .from("attendance")
      .select("*")
      .eq("worker_id", user.id)
      .gte("checked_at", today + "T00:00:00Z")
      .lte("checked_at", today + "T23:59:59Z")
      .then(({ data }) => {
        setAttendance(data ?? []);
      });
  }, [user]);

  const handleCheck = async (scheduleId: string, type: "출근" | "퇴근") => {
    if (!user) return;
    setAttLoading(true);
    setGeoError("");
    // 위치 정보 먼저 요청
    if (!navigator.geolocation) {
      setGeoError("이 기기에서 위치 정보를 지원하지 않습니다.");
      setAttLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const now = new Date();
        // type 변환: '출근' → 'checkin', '퇴근' → 'checkout'
        const typeValue = type === "출근" ? "checkin" : "checkout";
        // 출근/퇴근 기록
        const { error } = await supabase.from("attendance").insert({
          worker_id: user.id,
          schedule_id: scheduleId,
          type: typeValue,
          checked_at: now.toISOString(),
        });
        // 위치 기록
        await supabase.from("location_logs").insert({
          worker_id: user.id,
          schedule_id: scheduleId,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          logged_at: now.toISOString(),
          type, // 출근/퇴근 구분(여기는 한글 그대로)
        });
        if (!error) {
          // 알림 생성
          await supabase.from("notifications").insert({
            user_id: user.id,
            message: type === "출근" ? "출근 완료" : "퇴근 완료",
            is_read: false,
          });
          // 새로고침 (checked_at 기준)
          const today = now.toISOString().slice(0, 10);
          const { data } = await supabase
            .from("attendance")
            .select("*")
            .eq("worker_id", user.id)
            .gte("checked_at", today + "T00:00:00Z")
            .lte("checked_at", today + "T23:59:59Z");
          setAttendance(data ?? []);
        }
        setAttLoading(false);
      },
      () => {
        setGeoError(
          "위치 정보를 가져올 수 없습니다. 위치 권한을 허용해 주세요."
        );
        setAttLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) return <div>로딩 중...</div>;

  // 일정별 출근/퇴근 상태 계산
  function getAttStatus(scheduleId: string) {
    const att = attendance.filter((a) => a.schedule_id === scheduleId);
    const hasCheckin = att.some((a) => a.type === "checkin");
    const hasCheckout = att.some((a) => a.type === "checkout");
    if (hasCheckin && hasCheckout) return "근무완료";
    if (hasCheckin) return "출근중";
    return "출근대기";
  }

  return (
    <div
      style={{
        maxWidth: 480,
        margin: "40px auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        textAlign: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>오늘의 일정</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontWeight: 500 }}>{userName}</span>
          <button onClick={handleLogout} style={{ marginLeft: 8 }}>
            로그아웃
          </button>
        </div>
      </div>
      {geoError && (
        <div style={{ color: "red", marginBottom: 8 }}>{geoError}</div>
      )}
      <ul>
        {schedules.length === 0 && <li>오늘 일정이 없습니다.</li>}
        {schedules.map((sch) => {
          const scheduleId = String(sch.id);
          const status = getAttStatus(scheduleId);
          return (
            <li
              key={scheduleId}
              style={{
                marginBottom: 16,
                border: "1px solid #eee",
                borderRadius: 8,
                padding: 12,
              }}
            >
              환자: {String(sch.patient_id)} <br />
              시간: {String(sch.start_time)} ~ {String(sch.end_time)}
              <br />
              상태: {status}
              <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                {status === "출근대기" && (
                  <button
                    disabled={attLoading}
                    onClick={() => handleCheck(scheduleId, "출근")}
                  >
                    출근
                  </button>
                )}
                {status === "출근중" && (
                  <button
                    disabled={attLoading}
                    onClick={() => handleCheck(scheduleId, "퇴근")}
                  >
                    퇴근
                  </button>
                )}
                {status === "근무완료" && (
                  <span style={{ color: "#007bff", fontWeight: 600 }}>
                    근무완료
                  </span>
                )}
                <button onClick={() => navigate(`/care-note/${scheduleId}`)}>
                  상태기록 작성
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default TodayScheduleList;
