import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

// 관리자 주요 탭 정의
const TABS = [
  { key: "schedule", label: "근무일정 관리" },
  { key: "attendance", label: "출퇴근 현황" },
  { key: "care", label: "환자 상태기록" },
  { key: "users", label: "요양보호사 전체" },
  { key: "patients", label: "환자 전체" },
];

type ScheduleRecord = {
  id: string;
  worker_id: string;
  patient_id: string;
  scheduled_date: string;
  start_time: string;
  end_time: string;
};

type AttendanceRecord = {
  id: string;
  worker_id: string;
  schedule_id: string;
  type: string; // "출근" | "퇴근"
  date: string;
  time: string;
};

type CareNoteRecord = {
  id: string;
  worker_id: string;
  schedule_id: string;
  note: string;
  created_at: string;
};

type UserRecord = {
  id: string;
  name?: string;
  email?: string;
};

type PatientRecord = {
  id: string;
  name?: string;
  birthdate?: string;
  gender?: string;
  address?: string;
  phone?: string;
};

function AdminPage() {
  const [tab, setTab] = useState("schedule");

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "40px auto",
        padding: 24,
        background: "#f7fafd",
        color: "#222",
        borderRadius: 12,
      }}
    >
      <h1 style={{ color: "#222" }}>관리자 페이지</h1>
      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              fontWeight: tab === t.key ? "bold" : undefined,
              background: "#e3e8f0",
              color: "#222",
              padding: "8px 20px",
              borderRadius: 6,
              cursor: "pointer",
              borderStyle: "solid",
              borderWidth: 0,
              borderColor: "transparent",
              borderBottomWidth: tab === t.key ? 2 : 0,
              borderBottomStyle: tab === t.key ? "solid" : undefined,
              borderBottomColor: tab === t.key ? "#007bff" : "transparent",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div
        style={{
          background: "#fff",
          borderRadius: 8,
          padding: 24,
          minHeight: 400,
          color: "#222",
        }}
      >
        {tab === "schedule" && <ScheduleAdminSection />}
        {tab === "attendance" && <AttendanceAdminSection />}
        {tab === "care" && <CareNoteAdminSection />}
        {tab === "users" && <UsersAdminSection />}
        {tab === "patients" && <PatientsAdminSection />}
      </div>
    </div>
  );
}

// 각 섹션 컴포넌트(실제 데이터 fetch/표시는 추후 구현)
function ScheduleAdminSection() {
  const [schedules, setSchedules] = useState<ScheduleRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    worker_id: "",
    patient_id: "",
    scheduled_date: "",
    start_time: "",
    end_time: "",
  });
  const [adding, setAdding] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    worker_id: "",
    patient_id: "",
    scheduled_date: "",
    start_time: "",
    end_time: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    supabase
      .from("schedules")
      .select("*")
      .order("scheduled_date", { ascending: false })
      .then(({ data }) => {
        setSchedules(data ?? []);
        setLoading(false);
      });
  }, [adding, editId]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setAdding(true);
    const { error } = await supabase.from("schedules").insert({
      worker_id: form.worker_id,
      patient_id: form.patient_id,
      scheduled_date: form.scheduled_date,
      start_time: form.start_time,
      end_time: form.end_time,
    });
    if (error) setError(error.message);
    setForm({
      worker_id: "",
      patient_id: "",
      scheduled_date: "",
      start_time: "",
      end_time: "",
    });
    setAdding(false);
  };

  const handleEdit = (sch: ScheduleRecord) => {
    setEditId(sch.id);
    setEditForm({
      worker_id: sch.worker_id,
      patient_id: sch.patient_id,
      scheduled_date: sch.scheduled_date,
      start_time: sch.start_time,
      end_time: sch.end_time,
    });
  };

  const handleEditSave = async (id: string) => {
    setError("");
    await supabase.from("schedules").update(editForm).eq("id", id);
    setEditId(null);
  };

  const handleDelete = async (id: string) => {
    setError("");
    await supabase.from("schedules").delete().eq("id", id);
    setEditId(null);
    setAdding((a) => !a); // 트리거용
  };

  return (
    <div>
      <h2 style={{ color: "#222" }}>전체 근무일정</h2>
      <form
        onSubmit={handleAdd}
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 16,
          alignItems: "center",
        }}
      >
        <input
          value={form.worker_id}
          onChange={(e) =>
            setForm((f) => ({ ...f, worker_id: e.target.value }))
          }
          placeholder="요양보호사ID"
          style={{
            padding: 6,
            borderRadius: 4,
            border: "1px solid #b6c2d1",
            width: 120,
          }}
          required
        />
        <input
          value={form.patient_id}
          onChange={(e) =>
            setForm((f) => ({ ...f, patient_id: e.target.value }))
          }
          placeholder="환자ID"
          style={{
            padding: 6,
            borderRadius: 4,
            border: "1px solid #b6c2d1",
            width: 120,
          }}
          required
        />
        <input
          value={form.scheduled_date}
          onChange={(e) =>
            setForm((f) => ({ ...f, scheduled_date: e.target.value }))
          }
          type="date"
          placeholder="날짜(YYYY-MM-DD)"
          style={{
            padding: 6,
            borderRadius: 4,
            border: "1px solid #b6c2d1",
            width: 120,
          }}
          required
        />
        <input
          value={form.start_time}
          onChange={(e) =>
            setForm((f) => ({ ...f, start_time: e.target.value }))
          }
          type="time"
          placeholder="시작(HH:MM)"
          style={{
            padding: 6,
            borderRadius: 4,
            border: "1px solid #b6c2d1",
            width: 90,
          }}
          required
        />
        <input
          value={form.end_time}
          onChange={(e) => setForm((f) => ({ ...f, end_time: e.target.value }))}
          type="time"
          placeholder="종료(HH:MM)"
          style={{
            padding: 6,
            borderRadius: 4,
            border: "1px solid #b6c2d1",
            width: 90,
          }}
          required
        />
        <button
          type="submit"
          disabled={adding}
          style={{
            padding: "6px 18px",
            borderRadius: 4,
            background: "#007bff",
            color: "#fff",
            border: "none",
            fontWeight: 500,
          }}
        >
          {adding ? "추가 중..." : "일정 추가"}
        </button>
        {error && <span style={{ color: "red", marginLeft: 8 }}>{error}</span>}
      </form>
      {loading ? (
        <div style={{ color: "#222" }}>불러오는 중...</div>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "#fff",
            color: "#222",
            fontSize: 15,
          }}
        >
          <thead>
            <tr style={{ background: "#e3e8f0", color: "#222" }}>
              <th style={{ padding: 8, border: "2px solid #b6c2d1" }}>
                요양보호사
              </th>
              <th style={{ padding: 8, border: "2px solid #b6c2d1" }}>환자</th>
              <th style={{ padding: 8, border: "2px solid #b6c2d1" }}>날짜</th>
              <th style={{ padding: 8, border: "2px solid #b6c2d1" }}>시작</th>
              <th style={{ padding: 8, border: "2px solid #b6c2d1" }}>종료</th>
              <th style={{ padding: 8, border: "2px solid #b6c2d1" }}>
                수정/삭제
              </th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((sch) => (
              <tr
                key={sch.id}
                style={{ background: "#fff" }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background = "#f1f5fa")
                }
                onMouseOut={(e) => (e.currentTarget.style.background = "#fff")}
              >
                {editId === sch.id ? (
                  <React.Fragment key={sch.id}>
                    <td style={{ padding: 8, border: "2px solid #b6c2d1" }}>
                      <input
                        value={editForm.worker_id}
                        onChange={(e) =>
                          setEditForm((f) => ({
                            ...f,
                            worker_id: e.target.value,
                          }))
                        }
                        style={{ width: 90 }}
                      />
                    </td>
                    <td style={{ padding: 8, border: "2px solid #b6c2d1" }}>
                      <input
                        value={editForm.patient_id}
                        onChange={(e) =>
                          setEditForm((f) => ({
                            ...f,
                            patient_id: e.target.value,
                          }))
                        }
                        style={{ width: 90 }}
                      />
                    </td>
                    <td style={{ padding: 8, border: "2px solid #b6c2d1" }}>
                      <input
                        value={editForm.scheduled_date}
                        onChange={(e) =>
                          setEditForm((f) => ({
                            ...f,
                            scheduled_date: e.target.value,
                          }))
                        }
                        type="date"
                        style={{ width: 100 }}
                      />
                    </td>
                    <td style={{ padding: 8, border: "2px solid #b6c2d1" }}>
                      <input
                        value={editForm.start_time}
                        onChange={(e) =>
                          setEditForm((f) => ({
                            ...f,
                            start_time: e.target.value,
                          }))
                        }
                        type="time"
                        style={{ width: 70 }}
                      />
                    </td>
                    <td style={{ padding: 8, border: "2px solid #b6c2d1" }}>
                      <input
                        value={editForm.end_time}
                        onChange={(e) =>
                          setEditForm((f) => ({
                            ...f,
                            end_time: e.target.value,
                          }))
                        }
                        type="time"
                        style={{ width: 70 }}
                      />
                    </td>
                    <td style={{ padding: 8, border: "2px solid #b6c2d1" }}>
                      <button
                        onClick={() => handleEditSave(sch.id)}
                        style={{
                          marginRight: 6,
                          background: "#007bff",
                          color: "#fff",
                          border: "none",
                          borderRadius: 4,
                          padding: "4px 10px",
                        }}
                      >
                        저장
                      </button>
                      <button
                        onClick={() => setEditId(null)}
                        style={{
                          background: "#eee",
                          color: "#222",
                          border: "none",
                          borderRadius: 4,
                          padding: "4px 10px",
                        }}
                      >
                        취소
                      </button>
                    </td>
                  </React.Fragment>
                ) : (
                  <React.Fragment key={sch.id}>
                    <td style={{ padding: 8, border: "2px solid #b6c2d1" }}>
                      {sch.worker_id}
                    </td>
                    <td style={{ padding: 8, border: "2px solid #b6c2d1" }}>
                      {sch.patient_id}
                    </td>
                    <td style={{ padding: 8, border: "2px solid #b6c2d1" }}>
                      {sch.scheduled_date}
                    </td>
                    <td style={{ padding: 8, border: "2px solid #b6c2d1" }}>
                      {sch.start_time}
                    </td>
                    <td style={{ padding: 8, border: "2px solid #b6c2d1" }}>
                      {sch.end_time}
                    </td>
                    <td style={{ padding: 8, border: "2px solid #b6c2d1" }}>
                      <button
                        onClick={() => handleEdit(sch)}
                        style={{
                          marginRight: 6,
                          background: "#007bff",
                          color: "#fff",
                          border: "none",
                          borderRadius: 4,
                          padding: "4px 10px",
                        }}
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(sch.id)}
                        style={{
                          background: "#ff4d4f",
                          color: "#fff",
                          border: "none",
                          borderRadius: 4,
                          padding: "4px 10px",
                        }}
                      >
                        삭제
                      </button>
                    </td>
                  </React.Fragment>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function AttendanceAdminSection() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const today = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
    supabase
      .from("attendance")
      .select("*")
      .gte("checked_at", today + "T00:00:00Z")
      .lte("checked_at", today + "T23:59:59Z")
      .then(({ data }) => {
        setRecords(data ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h2 style={{ color: "#222" }}>출퇴근 현황</h2>
      {loading ? (
        <div style={{ color: "#222" }}>불러오는 중...</div>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "#fff",
            color: "#222",
            fontSize: 15,
          }}
        >
          <thead>
            <tr style={{ background: "#e3e8f0", color: "#222" }}>
              <th style={{ padding: 8, border: "2px solid #b6c2d1" }}>
                요양보호사
              </th>
              <th style={{ padding: 8, border: "2px solid #b6c2d1" }}>
                일정ID
              </th>
              <th style={{ padding: 8, border: "2px solid #b6c2d1" }}>구분</th>
              <th style={{ padding: 8, border: "2px solid #b6c2d1" }}>날짜</th>
              <th style={{ padding: 8, border: "2px solid #b6c2d1" }}>시간</th>
            </tr>
          </thead>
          <tbody>
            {records.map((rec) => (
              <tr
                key={rec.id}
                style={{ background: "#fff" }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background = "#f1f5fa")
                }
                onMouseOut={(e) => (e.currentTarget.style.background = "#fff")}
              >
                <td style={{ padding: 8, border: "2px solid #b6c2d1" }}>
                  {rec.worker_id}
                </td>
                <td style={{ padding: 8, border: "2px solid #b6c2d1" }}>
                  {rec.schedule_id}
                </td>
                <td style={{ padding: 8, border: "2px solid #b6c2d1" }}>
                  {rec.type}
                </td>
                <td style={{ padding: 8, border: "2px solid #b6c2d1" }}>
                  {rec.date}
                </td>
                <td style={{ padding: 8, border: "2px solid #b6c2d1" }}>
                  {rec.time?.slice(11, 19)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function CareNoteAdminSection() {
  const [notes, setNotes] = useState<CareNoteRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    worker_id: "",
    schedule_id: "",
    note: "",
  });
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    supabase
      .from("care_notes")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setNotes(data ?? []);
        setLoading(false);
      });
  }, [adding]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setAdding(true);
    const { error } = await supabase.from("care_notes").insert({
      worker_id: form.worker_id,
      schedule_id: form.schedule_id,
      note: form.note,
    });
    if (error) setError(error.message);
    setForm({ worker_id: "", schedule_id: "", note: "" });
    setAdding(false);
  };

  return (
    <div>
      <h2 style={{ color: "#222" }}>환자 상태기록 전체</h2>
      <form
        onSubmit={handleAdd}
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 16,
          alignItems: "center",
        }}
      >
        <input
          value={form.worker_id}
          onChange={(e) =>
            setForm((f) => ({ ...f, worker_id: e.target.value }))
          }
          placeholder="요양보호사ID"
          style={{
            padding: 6,
            borderRadius: 4,
            border: "1px solid #b6c2d1",
            width: 120,
          }}
          required
        />
        <input
          value={form.schedule_id}
          onChange={(e) =>
            setForm((f) => ({ ...f, schedule_id: e.target.value }))
          }
          placeholder="일정ID"
          style={{
            padding: 6,
            borderRadius: 4,
            border: "1px solid #b6c2d1",
            width: 120,
          }}
          required
        />
        <input
          value={form.note}
          onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
          placeholder="기록 내용"
          style={{
            padding: 6,
            borderRadius: 4,
            border: "1px solid #b6c2d1",
            width: 240,
          }}
          required
        />
        <button
          type="submit"
          disabled={adding}
          style={{
            padding: "6px 18px",
            borderRadius: 4,
            background: "#007bff",
            color: "#fff",
            border: "none",
            fontWeight: 500,
          }}
        >
          {adding ? "추가 중..." : "상태기록 추가"}
        </button>
        {error && <span style={{ color: "red", marginLeft: 8 }}>{error}</span>}
      </form>
      {loading ? (
        <div style={{ color: "#222" }}>불러오는 중...</div>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "#fff",
            color: "#222",
            fontSize: 15,
          }}
        >
          <thead>
            <tr style={{ background: "#e3e8f0", color: "#222" }}>
              <th style={{ padding: 8, border: "2px solid #b6c2d1" }}>
                요양보호사
              </th>
              <th style={{ padding: 8, border: "2px solid #b6c2d1" }}>
                일정ID
              </th>
              <th style={{ padding: 8, border: "2px solid #b6c2d1" }}>
                기록내용
              </th>
              <th style={{ padding: 8, border: "2px solid #b6c2d1" }}>
                작성시각
              </th>
            </tr>
          </thead>
          <tbody>
            {notes.map((n) => (
              <tr
                key={n.id}
                style={{ background: "#fff" }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background = "#f1f5fa")
                }
                onMouseOut={(e) => (e.currentTarget.style.background = "#fff")}
              >
                <td style={{ padding: 8, border: "2px solid #b6c2d1" }}>
                  {n.worker_id}
                </td>
                <td style={{ padding: 8, border: "2px solid #b6c2d1" }}>
                  {n.schedule_id}
                </td>
                <td style={{ padding: 8, border: "2px solid #b6c2d1" }}>
                  {n.note}
                </td>
                <td style={{ padding: 8, border: "2px solid #b6c2d1" }}>
                  {n.created_at?.replace("T", " ").slice(0, 19)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// 요양보호사 전체 조회
function UsersAdminSection() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    supabase
      .from("users")
      .select("*")
      .then(({ data }) => {
        setUsers(data ?? []);
        setLoading(false);
      });
  }, []);
  return (
    <div>
      <h2 style={{ color: "#222" }}>요양보호사 전체</h2>
      {loading ? (
        <div style={{ color: "#222" }}>불러오는 중...</div>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "#fff",
            color: "#222",
            fontSize: 15,
          }}
        >
          <thead>
            <tr style={{ background: "#e3e8f0", color: "#222" }}>
              <th style={{ padding: 8, border: "2px solid #b6c2d1" }}>ID</th>
              <th style={{ padding: 8, border: "2px solid #b6c2d1" }}>이름</th>
              <th style={{ padding: 8, border: "2px solid #b6c2d1" }}>
                이메일
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr
                key={u.id}
                style={{ background: "#fff" }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background = "#f1f5fa")
                }
                onMouseOut={(e) => (e.currentTarget.style.background = "#fff")}
              >
                <td style={{ padding: 8, border: "2px solid #b6c2d1" }}>
                  {u.id}
                </td>
                <td style={{ padding: 8, border: "2px solid #b6c2d1" }}>
                  {u.name ?? "-"}
                </td>
                <td style={{ padding: 8, border: "2px solid #b6c2d1" }}>
                  {u.email ?? "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// 환자 전체 조회
function PatientsAdminSection() {
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    birthdate: "",
    gender: "",
    address: "",
    phone: "",
  });
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    supabase
      .from("patients")
      .select("*")
      .then(({ data }) => {
        setPatients(data ?? []);
        setLoading(false);
      });
  }, [adding]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setAdding(true);
    const { error } = await supabase.from("patients").insert({
      name: form.name,
      birthdate: form.birthdate,
      gender: form.gender,
      address: form.address,
      phone: form.phone,
    });
    if (error) setError(error.message);
    setForm({ name: "", birthdate: "", gender: "", address: "", phone: "" });
    setAdding(false);
  };

  return (
    <div>
      <h2 style={{ color: "#222" }}>환자 전체</h2>
      <form
        onSubmit={handleAdd}
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 16,
          alignItems: "center",
        }}
      >
        <input
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="이름"
          style={{
            padding: 6,
            borderRadius: 4,
            border: "1px solid #b6c2d1",
            width: 100,
          }}
          required
        />
        <input
          type="date"
          value={form.birthdate}
          onChange={(e) =>
            setForm((f) => ({ ...f, birthdate: e.target.value }))
          }
          placeholder="생년월일"
          style={{
            padding: 6,
            borderRadius: 4,
            border: "1px solid #b6c2d1",
            width: 150,
          }}
          required
        />
        <select
          value={form.gender}
          onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
          style={{
            padding: 6,
            borderRadius: 4,
            border: "1px solid #b6c2d1",
            width: 80,
          }}
          required
        >
          <option value="">성별</option>
          <option value="남">남</option>
          <option value="여">여</option>
        </select>
        <input
          value={form.address}
          onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
          placeholder="주소"
          style={{
            padding: 6,
            borderRadius: 4,
            border: "1px solid #b6c2d1",
            width: 180,
          }}
        />
        <input
          value={form.phone}
          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          placeholder="전화번호"
          style={{
            padding: 6,
            borderRadius: 4,
            border: "1px solid #b6c2d1",
            width: 120,
          }}
        />
        <button
          type="submit"
          disabled={adding}
          style={{
            padding: "6px 18px",
            borderRadius: 4,
            background: "#007bff",
            color: "#fff",
            border: "none",
            fontWeight: 500,
          }}
        >
          {adding ? "추가 중..." : "환자 추가"}
        </button>
        {error && <span style={{ color: "red", marginLeft: 8 }}>{error}</span>}
      </form>
      {loading ? (
        <div style={{ color: "#222" }}>불러오는 중...</div>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "#fff",
            color: "#222",
            fontSize: 15,
          }}
        >
          <thead>
            <tr style={{ background: "#e3e8f0", color: "#222" }}>
              <th style={{ padding: 8, border: "2px solid #b6c2d1" }}>ID</th>
              <th style={{ padding: 8, border: "2px solid #b6c2d1" }}>이름</th>
              <th style={{ padding: 8, border: "2px solid #b6c2d1" }}>
                생년월일
              </th>
              <th style={{ padding: 8, border: "2px solid #b6c2d1" }}>성별</th>
              <th style={{ padding: 8, border: "2px solid #b6c2d1" }}>주소</th>
              <th style={{ padding: 8, border: "2px solid #b6c2d1" }}>
                전화번호
              </th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <tr
                key={p.id}
                style={{ background: "#fff" }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background = "#f1f5fa")
                }
                onMouseOut={(e) => (e.currentTarget.style.background = "#fff")}
              >
                <td style={{ padding: 8, border: "2px solid #b6c2d1" }}>
                  {p.id}
                </td>
                <td style={{ padding: 8, border: "2px solid #b6c2d1" }}>
                  {p.name ?? "-"}
                </td>
                <td style={{ padding: 8, border: "2px solid #b6c2d1" }}>
                  {p.birthdate ?? "-"}
                </td>
                <td style={{ padding: 8, border: "2px solid #b6c2d1" }}>
                  {p.gender ?? "-"}
                </td>
                <td style={{ padding: 8, border: "2px solid #b6c2d1" }}>
                  {p.address ?? "-"}
                </td>
                <td style={{ padding: 8, border: "2px solid #b6c2d1" }}>
                  {p.phone ?? "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminPage;
