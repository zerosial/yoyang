# Supabase Auth 연동 및 API 활용 가이드 (CareNote)

## 1. Supabase Auth 연동 예시 (React/JS)

### 1) 설치

```bash
npm install @supabase/supabase-js
```

### 2) 클라이언트 초기화

```typescript
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://<your-project-id>.supabase.co",
  "<your-anon-key>"
);
```

### 3) 회원가입/로그인/로그아웃

```typescript
// 회원가입
const { user, error } = await supabase.auth.signUp({
  email: "user@email.com",
  password: "password123",
});

// 로그인
const { user, error } = await supabase.auth.signInWithPassword({
  email: "user@email.com",
  password: "password123",
});

// 로그아웃
await supabase.auth.signOut();
```

### 4) 현재 로그인 유저 정보 및 역할 확인

```typescript
const {
  data: { user },
} = await supabase.auth.getUser();
// user.id로 users 테이블에서 role 등 추가 정보 조회 필요
const { data: userProfile } = await supabase
  .from("users")
  .select("id, name, role")
  .eq("id", user?.id)
  .single();
```

---

## 2. 데이터 모델 타입 정의 (TypeScript)

`.notes/supabase_typescript_types.md` 참고 (자동 생성)

예시:

```typescript
import type { Database } from "./supabase_typescript_types";

type User = Database["public"]["Tables"]["users"]["Row"];
type Schedule = Database["public"]["Tables"]["schedules"]["Row"];
type Attendance = Database["public"]["Tables"]["attendance"]["Row"];
type CareNote = Database["public"]["Tables"]["care_notes"]["Row"];
```

---

## 3. 주요 API 호출 예시 (React/JS)

### 1) 일정 조회 (근무자)

```typescript
const { data: schedules, error } = await supabase
  .from("schedules")
  .select("*")
  .eq("worker_id", userId)
  .eq("scheduled_date", "2024-05-28");
```

### 2) 출퇴근 체크 (insert)

```typescript
const { error } = await supabase.from("attendance").insert({
  worker_id: userId,
  schedule_id: scheduleId,
  type: "checkin", // 또는 'checkout'
  checked_at: new Date().toISOString(),
  latitude,
  longitude,
});
```

### 3) 환자 상태기록 작성

```typescript
const { error } = await supabase.from("care_notes").insert({
  patient_id,
  worker_id: userId,
  schedule_id,
  note: "환자 상태 메모",
});
```

### 4) 알림 조회

```typescript
const { data: notifications } = await supabase
  .from("notifications")
  .select("*")
  .eq("user_id", userId)
  .order("created_at", { ascending: false });
```

---

## 4. 참고 사항

- RLS(행 수준 보안) 정책에 따라 본인/역할별 데이터만 접근 가능
- 에러 발생 시 error 객체 활용, 네트워크/권한 오류 구분 필요
- 자세한 타입/관계는 `.notes/supabase_typescript_types.md` 참고

---

> 이 문서는 CareNote 웹/앱 개발자가 Supabase Auth 및 데이터 API를 빠르게 연동할 수 있도록 작성되었습니다.
