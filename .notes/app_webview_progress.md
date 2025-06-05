# CareNote 앱(WebView) 개발 진행상황 (2024-05-28)

## 1. 폴더/파일 구조 및 주요 컴포넌트 구현

- React 기반 SPA 구조 설계 및 폴더/파일 생성
- 주요 컴포넌트:
  - 로그인(LoginPage)
  - 오늘의 일정(TodayScheduleList)
  - 환자 상태기록(CareNoteForm)
  - 알림(NotificationList)
  - 위치 기록(LocationHistory)
- 인증 상태 관리 훅(useAuth) 구현
- React Router로 라우팅(App.tsx)

## 2. Supabase 연동

- `@supabase/supabase-js` 패키지 설치 및 클라이언트 초기화
- 실제 프로젝트 URL/anon key 적용:
  - URL: https://xcgckoklfqlmrjtwfupb.supabase.co
  - anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjZ2Nrb2tsZnFsbXJqdHdmdXBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0MDYwMTksImV4cCI6MjA2Mzk4MjAxOX0.QS9XlJv_MqMM0hii7s2eotg0kFKTt0RVVnPyXVq1q3Q
- src/supabaseClient.ts에 실제 값 반영 완료

## 3. 개발자 참고 사항

- Supabase Auth 및 DB 연동 정상 동작
- 각 컴포넌트는 MVP 요구사항에 맞는 기본 기능만 구현(추후 확장 가능)
- 타입/관계/정책 등은 `.notes/supabase_typescript_types.md`, `.notes/supabase_auth_api_guide.md` 참고

---

> 이 문서는 CareNote 앱(WebView) 개발의 진행상황과 실제 환경 연동 내역을 기록합니다.
