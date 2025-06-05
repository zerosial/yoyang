import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../hooks/useAuth";
import type { User } from "@supabase/supabase-js";

function NotificationList() {
  const user = useAuth() as User | null;
  const [notifications, setNotifications] = useState<Record<string, unknown>[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setNotifications(data ?? []);
        setLoading(false);
      });
  }, [user]);

  if (loading) return <div>로딩 중...</div>;

  return (
    <div style={{ maxWidth: 400, margin: "40px auto" }}>
      <h2>알림 센터</h2>
      <ul>
        {notifications.length === 0 && <li>알림이 없습니다.</li>}
        {notifications.map((n) => (
          <li key={String(n.id)} style={{ marginBottom: 10 }}>
            {String(n.message)}
            <span
              style={{ color: n.is_read ? "#888" : "#007bff", marginLeft: 8 }}
            >
              {n.is_read ? "(읽음)" : "(신규)"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NotificationList;
