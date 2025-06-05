import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../hooks/useAuth";
import type { User } from "@supabase/supabase-js";

function LocationHistory() {
  const user = useAuth() as User | null;
  const [logs, setLogs] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const today = new Date().toISOString().slice(0, 10);
    supabase
      .from("location_logs")
      .select("*")
      .eq("worker_id", user.id)
      .gte("logged_at", today + "T00:00:00Z")
      .lte("logged_at", today + "T23:59:59Z")
      .order("logged_at", { ascending: true })
      .then(({ data }) => {
        setLogs(data ?? []);
        setLoading(false);
      });
  }, [user]);

  if (loading) return <div>로딩 중...</div>;

  return (
    <div style={{ maxWidth: 400, margin: "40px auto" }}>
      <h2>오늘의 위치 기록</h2>
      <ul>
        {logs.length === 0 && <li>기록이 없습니다.</li>}
        {logs.map((log) => (
          <li key={String(log.id)}>
            {String(log.logged_at)} - 위도: {String(log.latitude)}, 경도:{" "}
            {String(log.longitude)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LocationHistory;
