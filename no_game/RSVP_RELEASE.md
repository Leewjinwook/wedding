# 참석 응답 / 방명록 작업 결과

## 1. 생성한 파일

- `js/supabase-config.js`: 제공한 Project URL·공개 키
- `js/wedding-api.js`: 지연 로딩 Supabase SDK, 저장·RPC·오류 처리
- `js/wedding-forms.js`: 공통 모달·검증·통계
- `js/rsvp.js`, `js/guestbook.js`, `js/wedding-social.js`: 청첩장 추가 기능
- `wedding-social.css`: 새 영역에만 적용되는 스타일
- `admin.html`, `js/admin.js`: 관리자 로그인·통계·명단
- `supabase/schema.sql`: 테이블·RLS·권한·비밀번호 RPC
- `SUPABASE_SETUP.md`: Supabase 설정 및 배포 절차
- `tests/wedding-forms.test.js`, `tests/database-security.mjs`: 검증 테스트

## 2. 수정한 파일

- `index.html`: 추가 기능 전용 CSS 링크 한 줄
- `js/app.js`: 청첩장 생성 후 추가 기능 모듈 지연 로딩
- `package.json`: 선택적 로컬 DB 테스트 의존성 및 테스트 명령
- `README.md`, `VERIFICATION.md`: 설정 안내와 검증 결과

`js/invitation.js`, `js/art.js`, `style.css`는 작업 전후 SHA-256이 동일합니다. 완성된 마음 전하실 곳, 계좌정보, 복사 동작을 수정하지 않았습니다. 사진·게임·음악·지도 코드도 변경하지 않았습니다.

## 3. 구현 기능

- RSVP: 참석/불참, 신랑/신부측, 본인 포함 1~20명, 식사 여부, 선택 메시지
- 성공 후에만 초기화/닫기; 제출 중 버튼 잠금; 실패한 입력 유지; 재시도 UUID 중복 방지
- 방명록 최근 3개, 최신순, 전체보기 20개씩 더보기
- 서버 bcrypt 해시, 비밀번호 RPC 삭제, 5회 실패 시 5분 잠금
- 텍스트 기반 렌더링으로 XSS 방지; 제한된 이름/메시지 길이; 기본 스팸 필드 및 제출 간격
- 관리자 Auth 로그인·RLS UID 허용 목록, 6종 통계, 명단과 메시지, 로그아웃

## 4. Dashboard에서 해야 할 작업

SQL 실행, 관리자 Auth 사용자 생성, 실제 관리자 UID 등록이 남아 있습니다. 공개 키로는 이러한 관리 작업을 실행할 수 없습니다.

## 5. 입력할 값

Project URL/Publishable key는 이미 설정했습니다. **실제 관리자 Auth UID만 SQL에 넣습니다.** 관리자 비밀번호는 Supabase에서 직접 정하고 관리자 로그인 화면에 입력합니다. 코드에 넣지 않습니다.

## 6. SQL 실행

SQL Editor → New query → `supabase/schema.sql` 전체 복사 → Run.

## 7. 관리자 계정

Authentication → Users → Add user → Create new user에서 계정 생성 후 UID 복사. `SUPABASE_SETUP.md`의 `wedding_private.admins` INSERT 예시에 실제 UID를 넣어 실행합니다.

## 8. 로컬 테스트

`node serve.mjs` → `http://127.0.0.1:4173/`, 관리자 `/admin.html`.

- 단위 테스트 4개 통과: 인원/길이/필수값, 불참 정규화, bcrypt 바이트 제한, 통계.
- 로컬 PostgreSQL(PGlite) 20개 DB 보안/검증 확인 통과: SQL 재실행, 익명/비관리자 조회 차단, 관리자 조회, 해시 비공개, 직접 삭제 차단, 비밀번호 검증·잠금, 중복 작성 방지, DB 제약.
- 별도 로컬 DB/API 테스트 환경에서 브라우저 저장 성공·방명록 작성/삭제·잘못된 비밀번호·최신 3개·20→23개 더보기·XSS 문자열 표시 확인.
- 실제 Supabase는 키 정상, 테이블/RPC 미설정 응답 확인. 사용자에게 준비 중 안내, 실패 입력 유지, 제출 중 disabled 확인.
- 기존 게임 1장 시작·대사·음악 재생 상태, 사진 01→02/15, 계좌 펼침/복사 성공 안내 확인.
- 360px 화면에서 RSVP 모달과 관리자 로그인 가로 넘침 없음.
- 로컬 카카오 SDK는 기존 도메인 문제로 연결되지 않아 기존 OSM 대체 지도가 표시됨. 카카오 지도 정상 연결을 새로 검증했다는 의미는 아님.

## 9. GitHub Pages 배포 후 테스트

ZIP 내부 프로젝트 파일을 기존 저장소 루트에 덮어 올리고 배포 완료 후 실제 휴대폰에서 참석 저장, 방명록 작성/삭제, 관리자 `/wedding/admin.html` 로그인을 확인합니다. 실제 Supabase 저장과 실제 관리자 로그인은 **SQL 실행 및 관리자 설정 전이므로 미검증**입니다. 로컬 테스트 데이터는 실제 프로젝트에 넣지 않았습니다.
