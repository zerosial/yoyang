# 요양(yoyang)

요양보호사와 관리자(센터 직원)를 위한 디지털 케어 업무 관리 시스템(MVP)
바이브코딩 , Cursor를 사용한 확장성 테스트

---

## 프로젝트 개요

케어노트는 요양보호사의 출퇴근, 환자 상태기록, 위치 추적, 일정 관리, 알림 등 현장 업무를 디지털화하여 효율적이고 투명한 케어 서비스를 지원하는 플랫폼입니다. 모바일 앱(요양보호사용, WebView 기반)과 웹(관리자용 SPA), 그리고 Supabase 기반 백엔드로 구성되어 있습니다.

---

## 주요 기능

### 앱(요양보호사)

- **로그인/회원가입**: Supabase Auth 연동, 이메일 인증
- **오늘의 일정**: 배정된 환자 방문 일정 확인
- **출근/퇴근 체크**: 위치 정보와 함께 출근/퇴근 기록
- **환자 상태기록**: 방문별 상태 메모 작성 및 리스트 확인
- **알림 센터**: 일정 변경, 공지 등 실시간 알림 확인
- **위치 기록**: 출근/퇴근 시 자동 위치 기록, 이동 경로 확인

### 웹(관리자/센터직원)

- **근무일정 관리**: 요양보호사별 일정 배정/수정/삭제
- **실시간 출퇴근/위치 현황판**: 근무 상태, 위치, 이동 경로 모니터링
- **환자 상태기록 열람**: 요양보호사 기록 검토 및 관리
- **알림/공지 관리**: 일정 변경, 긴급 배정 등 알림 발송

---

## 기술 스택

- **프론트엔드**: React, TypeScript, Vite, React Router
- **백엔드/BaaS**: Supabase (PostgreSQL, Auth, Storage, Realtime)
- **배포/버전관리**: GitHub, Supabase Hosting

---

## 폴더 구조 예시

```
careNote/
  src/
    components/   # 주요 UI 컴포넌트 (Admin, Auth, CareNote 등)
    hooks/         # 커스텀 훅 (useAuth 등)
    types/         # 타입 정의
  public/
  .notes/         # 요구사항, DB, API, 개발가이드 문서
  package.json
  vite.config.ts
  README.md
```

---

## Supabase 연동 예시

```typescript
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://xcgckoklfqlmrjtwfupb.supabase.co", // 실제 프로젝트 URL
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFz..." // anon key
);
```

### 회원가입/로그인/로그아웃

```typescript
// 회원가입
await supabase.auth.signUp({ email, password });
// 로그인
await supabase.auth.signInWithPassword({ email, password });
// 로그아웃
await supabase.auth.signOut();
```

---

## 데이터베이스 구조 요약

- **users**: 사용자(요양보호사/관리자), 역할 포함
- **patients**: 환자 정보
- **schedules**: 근무 일정(요양보호사-환자 매핑)
- **attendance**: 출퇴근 기록(위치, 시각)
- **location_logs**: 위치/경로 기록
- **care_notes**: 환자 상태기록(방문별 메모)
- **notifications**: 알림 메시지

> RLS(행 수준 보안) 정책 적용, 역할별 접근 제한

---

## 개발/실행 방법

1. 패키지 설치
   ```bash
   npm install
   ```
2. 개발 서버 실행
   ```bash
   npm run dev
   ```
3. 환경 변수(Supabase URL/Key)는 `src/supabaseClient.ts`에서 관리

---

## 참고 문서 및 내부 가이드

- 프로젝트 요구사항/기획: `.notes/project_overview.md`
- DB 설계/정책 요약: `.notes/supabase_db_summary.md`
- Supabase Auth/API 연동: `.notes/supabase_auth_api_guide.md`
- 타입 정의: `.notes/supabase_typescript_types.md`
- 앱(WebView) 구조/진행: `.notes/app_webview_progress.md`

---

## 문의/기여

- GitHub Issue 또는 Pull Request로 문의/기여 바랍니다.
