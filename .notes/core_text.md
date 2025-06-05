1. 전체 시스템 구조 요약
   모바일 앱(요양보호사용):
   WebView 기반 하이브리드 앱 (React 등 SPA 프레임워크 활용)
   주요 기능: 출퇴근 체크, 일정 확인, 위치 전송, 환자 상태기록, 알림 수신
   웹(관리자/센터직원용):
   데스크톱/반응형 SPA (React 등)
   주요 기능: 요양보호사 일정 관리, 실시간 위치/출퇴근 현황, 환자 상태 열람, 담당자 배정
   백엔드:
   Supabase (PostgreSQL, Auth, Storage, Realtime)
   RESTful API 및 실시간 데이터 연동
2. 개발 단계별 플랜

1) 백엔드(Supabase) 설계
   주요 테이블
   users (요양보호사/관리자 구분, 인증)
   schedules (근무 일정)
   attendance (출퇴근 기록)
   location_logs (위치/경로 기록)
   care_notes (환자 상태기록)
   notifications (알림)
   권한/보안
   Row Level Security(RLS)로 역할별 데이터 접근 제한
   Supabase Auth로 로그인/권한 관리
   API
   Supabase가 자동 생성하는 REST API 활용
   실시간 데이터(출퇴근, 알림 등)는 Supabase Realtime 구독
2) 프론트엔드(앱/웹) 설계
   (1) 모바일 앱(요양보호사)
   주요 화면
   출근/퇴근 체크
   오늘의 일정/방문지 리스트
   환자 상태기록 입력
   알림 센터
   내 위치/경로 확인
   기술
   React 기반 SPA + Capacitor/Cordova로 WebView 패키징
   Supabase JS SDK로 API 연동
   (2) 웹(관리자/센터직원)
   주요 화면
   요양보호사별 근무일정 캘린더/표
   실시간 출퇴근 현황판
   지도 기반 위치/경로 모니터링
   환자별 상태기록 열람/코멘트
   담당자 배정/변경
   기술
   React 기반 SPA
   Supabase JS SDK로 API 연동
   지도: Google Maps API 등 활용

3. 초기 개발 순서 제안
   Supabase 프로젝트/DB 스키마 설계 및 생성
   공통 인증(로그인/역할) 구현
   앱/웹 공통 데이터 모델 및 API 연동 구조 설계
   앱: 출퇴근 체크, 일정 확인, 상태기록 입력 UI/로직
   웹: 일정 관리, 출퇴근/위치 현황판, 상태기록 열람 UI/로직
   실시간 데이터(출퇴근, 알림 등) 연동
   테스트/배포
