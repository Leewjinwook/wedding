# 참석 응답 · 방명록 설정

코드는 준비되어 있습니다. **SQL 실행 → 관리자 계정 생성 → 관리자 UID 등록 → GitHub 업로드** 순서로 진행하세요. Project URL과 Publishable key는 제공해 주신 실제 값으로 이미 `js/supabase-config.js`에 설정했습니다. service_role / Secret key는 사용하지 않습니다.

## 1. 데이터베이스 준비

1. https://supabase.com/dashboard 에 로그인하고 이번 청첩장 프로젝트를 엽니다.
2. 왼쪽 **SQL Editor → New query**를 선택합니다.
3. 프로젝트 폴더의 `supabase/schema.sql` 전체 내용을 복사해서 붙여 넣습니다.
4. **Run**을 누릅니다. 오류 없이 실행되어야 합니다. 일부 문장만 선택해서 실행하지 마세요.
5. **Table Editor**에서 `attendance`, `guestbook`이 만들어졌는지 확인합니다.

SQL은 데이터 삭제 없이 다시 실행할 수 있습니다. 단, 같은 이름으로 다른 구조의 테이블이 이미 있으면 자동 변환하지 않습니다. 이 경우 오류 내용을 확인해야 합니다. pgcrypto가 다른 스키마에 이미 설치되어 있다는 오류가 있다면 Database → Extensions에서 설치 스키마를 확인하세요. 이 SQL은 Supabase 기본 `extensions` 스키마를 사용합니다.

생성되는 항목:

| 항목 | 역할 |
|---|---|
| public.attendance | 이름·신랑/신부측·참석 여부·본인 포함 인원·식사 여부·메시지·작성일 |
| public.guestbook | 이름·메시지·비밀번호 해시·작성일·중복 방지 UUID·삭제 실패 횟수 |
| wedding_private.admins | 참석 응답을 조회할 관리자 Auth UID 목록 |
| list_guestbook | 비밀번호 해시 없이 공개 글만 조회하는 RPC |
| create_guestbook | 서버에서 bcrypt 해시를 만들어 글을 저장하는 RPC |
| delete_guestbook | 서버에서 비밀번호 확인 후 삭제하는 RPC |
| is_wedding_admin | 현재 로그인 사용자가 허용된 관리자인지 확인 |

## 2. RLS 확인

**Database → Tables / Table Editor**의 RLS 표시 또는 **Authentication → Policies**에서 정책을 확인합니다(UI 버전에 따라 위치가 다를 수 있습니다).

- attendance: RLS 활성화. `attendance_submit` INSERT 정책, `attendance_admin_read` 관리자 SELECT 정책.
- guestbook: RLS 활성화. 일반 방문자의 직접 테이블 접근은 차단합니다. 공개 읽기/쓰기/삭제는 지정된 RPC만 사용합니다. 테이블 SELECT 정책이 없는 것이 정상입니다.
- wedding_private.admins: 일반 방문자/로그인 사용자에게 읽기·쓰기 권한 없음.

SQL Editor에서 다음 명령으로도 확인할 수 있습니다.

```sql
select schemaname, tablename, policyname, cmd from pg_policies
where tablename in ('attendance','guestbook');
select n.nspname, c.relname, c.relrowsecurity
from pg_class c join pg_namespace n on n.oid=c.relnamespace
where (n.nspname='public' and c.relname in ('attendance','guestbook'))
or (n.nspname='wedding_private' and c.relname='admins');
```

Dashboard와 SQL Editor는 강한 관리 권한을 갖습니다. 여기서 명단이 보인다고 공개된 것은 아닙니다. 익명 API 요청에서는 attendance / guestbook 직접 조회가 권한 오류여야 하고, `list_guestbook` 결과에는 id/name/message/created_at만 있어야 합니다.

## 3. URL과 공개 키

현재 연결 값은 `js/supabase-config.js`에 이미 입력되어 있습니다. 다른 프로젝트로 바꿀 때만 수정하세요.

- **Project Settings → Data API** 또는 프로젝트 **Connect** 화면: Project URL.
- **Project Settings → API Keys**: Publishable key (`sb_publishable_...`). 구형 프로젝트는 Legacy anon key를 사용할 수 있습니다.
- `SUPABASE_URL`, `SUPABASE_ANON_KEY` 두 값만 변경합니다. 변수 이름의 ANON은 공개 키를 의미하며 Publishable key도 지원합니다.
- Secret / service_role 키를 HTML, JS, GitHub에 넣지 마세요. 공개 키는 원래 브라우저에 표시되는 값이고 실제 권한은 RLS가 통제합니다.

## 4. 관리자 계정 만들기

1. **Authentication → Users → Add user → Create new user**에서 관리자 이메일과 비밀번호를 직접 입력합니다.
2. 본인이 관리하는 이메일을 사용합니다. Dashboard가 **Auto Confirm User** 옵션을 제공하면 관리자가 직접 만든 해당 계정에 적용하거나, 확인 메일을 완료하세요.
3. 생성된 사용자 상세 화면의 **User UID**를 복사합니다.
4. SQL Editor에서 아래 `YOUR_ADMIN_AUTH_UID`를 실제 UID로 바꿔 실행합니다. 가짜 UID로 실행하지 마세요.

```sql
insert into wedding_private.admins (user_id)
values ('YOUR_ADMIN_AUTH_UID'::uuid)
on conflict do nothing;
```

신랑·신부가 별도 계정으로 볼 경우 두 명 모두 위 과정을 반복합니다. 관리자 비밀번호는 코드에 넣거나 대화로 보내지 않습니다. 일반 사용자가 회원가입해도 이 UID 목록에 없으면 참석 응답을 읽을 수 없습니다. 공개 회원가입이 필요 없으므로 Authentication 설정의 신규 가입 허용은 꺼 두어도 됩니다.

관리자 권한을 해제하려면:

```sql
delete from wedding_private.admins where user_id='REMOVE_ADMIN_AUTH_UID'::uuid;
```

## 5. 로컬 실행 및 테스트

Node.js가 있는 환경에서 청첩장 프로젝트 폴더를 터미널로 열고 `node serve.mjs`를 실행합니다.

- 청첩장: http://127.0.0.1:4173/
- 관리자: http://127.0.0.1:4173/admin.html
- 입력 검증 테스트: `node --test tests/wedding-forms.test.js`
- 선택 사항: `npm install` 후 `npm run test:db`로 로컬 임시 PostgreSQL(PGlite)에서 RLS·비밀번호·DB 제약 검증을 실행할 수 있습니다. 테스트는 실제 Supabase에 데이터를 쓰지 않습니다. 이 개발용 의존성은 GitHub Pages 운영에 필요하지 않습니다.

1. 청첩장 바로 보기 → 마음 전하실 곳 아래 **참석 의사 전달하기**를 누릅니다.
2. 필수항목 없이 제출하면 저장되지 않는지 확인합니다.
3. 테스트 이름, 신랑측, 참석, 2명, 식사 선택 후 제출합니다. 성공 시에만 창이 닫히고 감사 문구가 나옵니다.
4. Table Editor → attendance에서 저장 확인. 불참은 인원 0, 식사 not_applicable로 저장됩니다.
5. **방명록 작성하기**에서 테스트 이름, 메시지, 6~64자 삭제 비밀번호를 입력합니다. 비밀번호는 bcrypt 제한으로 UTF-8 최대 72바이트입니다.
6. 작성 성공 후 최근 목록 최상단에 보이는지 확인합니다. 최근 3개, 전체보기는 20개씩 더 불러옵니다.
7. 삭제 × → 잘못된 비밀번호로 삭제 실패 → 올바른 비밀번호로 삭제 성공을 확인합니다. 5번 실패하면 해당 글 삭제가 5분 동안 잠깁니다.
8. 관리자 페이지에서 생성한 계정으로 로그인하고 통계와 목록을 확인합니다. 관리자 등록이 없는 계정은 조회가 거절되어야 합니다.
9. 테스트 참석 응답은 Dashboard에서 테스트 이름으로 확인한 행만 삭제합니다. 방명록은 작성 시 사용한 비밀번호로 직접 지울 수 있습니다.

## 6. GitHub Pages 배포

ZIP을 푼 `our-little-story` 폴더 **안의 파일들**을 기존 wedding 저장소 루트에 덮어 올립니다. 폴더가 한 겹 더 생기지 않게 주의합니다. 기존 사진/assets도 유지합니다.

- 청첩장: https://leewjinwook.github.io/wedding/
- 관리자: https://leewjinwook.github.io/wedding/admin.html

GitHub Pages 배포 완료 후 위 로컬 테스트의 참석 저장, 방명록 작성/삭제, 관리자 로그인 과정을 실제 휴대폰에서 한 번씩 반복합니다. 이번 수정은 로컬 파일만 바꾸므로 **GitHub 업로드 전에는 공개 주소에 새 기능이 생기지 않습니다.**

## 7. 운영 참고

- 관리자 로그인 세션은 메모리에만 저장됩니다. 새로고침/탭 종료 후에는 다시 로그인합니다.
- ‘식사 예정 인원’은 모두 식사한다고 응답한 참석 인원 합계입니다. 미정은 포함하지 않습니다. 동행인 중 일부만 식사하는 예외는 메시지로 확인합니다.
- DB 제약으로 인원 1~20명, 이름 30자, 메시지 300자를 제한합니다. 방명록 해시는 API로 공개하지 않습니다.
- 중복 클릭 방지, 같은 요청 UUID 재시도로 중복 저장 방지, 숨김 스팸 필드와 성공 후 15초 간격 제한이 있습니다. 이는 기본 방어이며 직접 API를 호출하는 자동 스팸을 완전히 차단하지는 않습니다. 필요할 때 CAPTCHA/Edge Function 방식으로 강화할 수 있습니다.
- SQL 실행 전에는 ‘접수 준비 중’ 또는 연결 오류 안내가 표시됩니다. 실패한 입력은 유지됩니다.
- Supabase SDK는 필요한 시점에만 CDN에서 가져옵니다. 접속 문제는 게임·사진·계좌 안내를 중단시키지 않습니다.
- 이 작업에서 관리자 UID는 임의로 만들거나 설정하지 않았습니다. 실제 UID 등록이 꼭 필요합니다.

공식 참고: [SQL 함수 및 SQL Editor](https://supabase.com/docs/guides/database/functions), [API 키](https://supabase.com/docs/guides/getting-started/api-keys), [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), [이메일/비밀번호 로그인](https://supabase.com/docs/reference/javascript/auth-signinwithpassword).
