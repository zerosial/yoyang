import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";

function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const user = useAuth();
  const [isAdmin, setIsAdmin] = useState<null | boolean>(null);
  const navigate = useNavigate();

  // 인증 체크
  useEffect(() => {
    console.log("AdminAuthGuard user:", user);
    if (user === null) return; // 아직 로딩 중이면 아무것도 하지 않음
    if (!user || !user.id) {
      setIsAdmin(false);
      return;
    }
    setIsAdmin(null); // 로딩 시작
    supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single()
      .then(({ data, error }) => {
        console.log("AdminAuthGuard users row:", data, error);
        if (error || !data || data.role !== "admin") {
          setIsAdmin(false);
        } else {
          setIsAdmin(true);
        }
      });
  }, [user]);

  // 인증 실패 시 navigate 한 번만 호출 + 3초 타임아웃 시 강제 로그아웃 및 이동
  useEffect(() => {
    if (isAdmin === false) {
      supabase.auth.signOut().then(() => {
        navigate("/admin-login", { replace: true });
      });
    }
    if (isAdmin === null) {
      const timeout = setTimeout(() => {
        supabase.auth.signOut().then(() => {
          navigate("/admin-login", { replace: true });
        });
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [isAdmin, navigate]);

  if (isAdmin === null) return <div>관리자 인증 확인 중...</div>;
  if (!isAdmin) return null;
  return <>{children}</>;
}

export default AdminAuthGuard;
