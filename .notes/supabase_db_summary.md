# Supabase DB 설계 및 정책 요약 (2024-05-28)

## 1. 테이블 구조

- **users**: 요양보호사/관리자/센터직원 등 사용자 정보, 역할(role) 포함
- **patients**: 환자(서비스 대상자) 정보
- **schedules**: 근무 일정(요양보호사-환자-일정 매핑)
- **attendance**: 출퇴근 체크 기록(위치, 시각 포함)
- **location_logs**: 위치/경로 기록(주기적 GPS)
- **care_notes**: 환자 상태기록(방문별 메모)
- **notifications**: 알림 메시지(일정 변경, 공지 등)

## 2. 인증 및 권한 정책(RLS)

- Supabase Auth(이메일/비밀번호) 기반 로그인
- users/patients/schedules 등 주요 테이블 RLS 활성화
- 본인 데이터만 조회/수정, 매니저만 일정/환자 등록, 관리자는 삭제 등 역할별 정책 적용

## 3. API/연동 구조

- Supabase REST API 및 JS SDK 활용
- 주요 엔드포인트:
  - 출퇴근 체크: `/rest/v1/attendance`
  - 일정 조회: `/rest/v1/schedules?worker_id=eq.{id}&date=eq.{날짜}`
  - 환자 상태기록: `/rest/v1/care_notes?patient_id=eq.{id}`
  - 위치 기록: `/rest/v1/location_logs`
  - 알림: `/rest/v1/notifications?user_id=eq.{id}`

---

> 이 문서는 2024-05-28 기준, 케어노트 MVP의 Supabase DB 설계/정책/구조의 핵심 요약입니다.
