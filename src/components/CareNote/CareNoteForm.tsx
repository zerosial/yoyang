import React, { useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../hooks/useAuth";
import { useSupabaseQuery } from "../../hooks/useSupabaseQuery";
import type { User } from "@supabase/supabase-js";

// CareNoteRecord 타입 정의 (간단 버전)
type CareNoteRecord = {
  id: string;
  worker_id: string;
  schedule_id: string;
  note: string;
  created_at: string;
};

function CareNoteForm() {
  const { scheduleId } = useParams();
  const user = useAuth() as User | null;
  const [note, setNote] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const queryFn = useCallback(async () => {
    console.log("care_notes fetch", scheduleId, new Date());
    if (!scheduleId) return Promise.resolve({ data: [], error: null });
    return supabase
      .from("care_notes")
      .select("*")
      .eq("schedule_id", scheduleId)
      .order("created_at", { ascending: false });
  }, [scheduleId]);

  const {
    data: notes,
    error,
    loading,
    retry,
  } = useSupabaseQuery<CareNoteRecord[]>(queryFn, [scheduleId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setSuccess(false);

    if (!user || !scheduleId) {
      setSubmitError("사용자 정보 또는 일정 정보가 없습니다.");
      return;
    }

    try {
      const { error } = await supabase.from("care_notes").insert({
        worker_id: user.id,
        schedule_id: scheduleId,
        note,
      });

      if (error) throw error;

      // 알림 생성
      await supabase.from("notifications").insert({
        user_id: user.id,
        message: "상태기록이 작성되었습니다.",
        is_read: false,
      });

      setSuccess(true);
      setNote(""); // 입력 필드 초기화
      retry(); // 데이터 새로고침
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "상태기록 작성 중 오류가 발생했습니다."
      );
    }
  };

  if (!scheduleId) {
    return <div>일정 정보가 없습니다.</div>;
  }

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: "0 20px" }}>
      <h2>환자 상태기록</h2>

      {/* 에러 표시 */}
      {error && (
        <div style={{ marginBottom: 20, color: "red" }}>
          데이터를 불러오는 중 오류가 발생했습니다.
          <button
            onClick={() => retry()}
            style={{ marginLeft: 10, padding: "4px 8px" }}
          >
            다시 시도
          </button>
        </div>
      )}

      {/* 작성 폼 */}
      <form onSubmit={handleSubmit}>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="환자의 상태를 기록해주세요..."
          required
          style={{
            width: "100%",
            minHeight: 100,
            padding: 8,
            marginBottom: 10,
            borderRadius: 4,
            border: "1px solid #ccc",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "8px 16px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          기록하기
        </button>
      </form>

      {/* 성공/에러 메시지 */}
      {success && (
        <div style={{ marginTop: 10, color: "green" }}>
          상태기록이 저장되었습니다.
        </div>
      )}
      {submitError && (
        <div style={{ marginTop: 10, color: "red" }}>{submitError}</div>
      )}

      {/* 기존 기록 목록 */}
      <div style={{ marginTop: 40 }}>
        <h3>기록 목록</h3>
        {loading ? (
          <div>불러오는 중...</div>
        ) : notes && notes.length > 0 ? (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {notes.map((note) => (
              <li
                key={note.id}
                style={{
                  padding: 16,
                  marginBottom: 10,
                  backgroundColor: "#f8f9fa",
                  borderRadius: 4,
                  border: "1px solid #dee2e6",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <span style={{ color: "#666", minWidth: 180 }}>
                    {new Date(note.created_at).toLocaleString()}
                  </span>
                  <span style={{ whiteSpace: "pre-wrap", color: "#222" }}>
                    {note.note}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div>아직 기록이 없습니다.</div>
        )}
      </div>
    </div>
  );
}

export default CareNoteForm;
