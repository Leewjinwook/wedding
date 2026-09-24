# 실행 검증 결과

검증일: 2026-09-23. Windows / 실제 Microsoft Edge(Chromium) 브라우저를 Playwright로 실행했습니다. 서버 주소는 `http://127.0.0.1:4173/wedding/`이며 저장소 하위 경로 배포 조건으로 확인했습니다.

## 통과

브라우저 기능 검사 **61개 통과**, JavaScript 실행 오류와 누락된 로컬 자산 응답 **0개**.

- 시작 → 서로 다른 하루 → 만남 → 동행 → 카페·꽃길·사진 → 프러포즈 → 웨딩 → 청첩장까지 실제 화면을 조작해 완료.
- 만남 후 동행 상태 전환 및 실제 이동 중 신부가 신랑을 따라오는 좌표 변화 확인.
- 다섯 목표에서 각각 보물상자가 열리고 세 장씩 사진 표시. 총 15장.
- 사진 좌우 전환 중 게임의 캐릭터 위치와 챕터가 멈추고, 닫으면 재개.
- 자동 진행을 끄면 이동 명령 취소. 재시작 시 위치·하트·보물상자·자동 진행 초기화.
- 전체 자동 진행에서 다섯 사진첩까지 지나 청첩장에 도착. 약 **110초**(검증 과정의 마무리 동작 포함).
- 모든 챕터의 청첩장 바로 보기 버튼 노출과 실제 전환 확인.
- 320×568, 360×640, 390×844, 1440×1000에서 수평 넘침 없음. 시작 버튼과 건너뛰기 표시 확인.
- 최신 픽셀 폰트를 적용한 320×568 화면에서 게임 하단 조작 영역의 아래쪽은 536px로 화면 안에 표시.
- 터치 이벤트로 Canvas를 드래그할 때 문서 스크롤이 발생하지 않음.
- 모션 감소 설정 반영.
- 2026년 12월 달력의 토요일 19일 표시.
- 한국 시간 자정 전후 D-1 → D-DAY → D+1 경계 확인.
- ICS 실제 다운로드 및 `DTSTART:20261219T020000Z` 확인. UTF-8 줄 접기 규격 확인. 종료 시각은 제공되지 않아 임의로 추가하지 않음.
- 현재 하위 경로 URL의 실제 클립보드 복사 확인.
- 지도 서비스 두 곳으로 연결하는 검색 URL과 전화 링크 `tel:0221118888` 확인.
- 원본 그림 2장의 화면 비율과 원본 파일 SHA-256 일치 확인.
- 전체 사진첩 15장 확인.
- Neo둥근모 로컬 웹폰트 로딩 확인.

## 배경음악 추가 검증

실제 브라우저의 자동 재생 정책을 두 조건으로 실행했습니다.

| 조건 | 결과 |
| --- | --- |
| 사용자 동작이 필요한 정책 | 로드 시 AudioContext `suspended`, 첫 클릭 후 `running` |
| 자동 재생이 허용된 정책 | 로드 시 바로 `running` |
| 음악 신호 | AnalyserNode에서 0이 아닌 실제 오디오 파형 확인 |
| 음악 끄기 | 재생 타이머 해제 및 활성 발음 노드 종료 확인 |
| 청첩장에서 음악 켜기 | 정상 재개 확인 |

음악은 직접 작성한 악보를 Web Audio로 합성합니다. 외부 음원을 다운로드하거나 복제하지 않았습니다.

## 직접 검증하지 않은 부분

- 실제 아이폰 Safari, Android Chrome, 카카오톡 내장 브라우저 하드웨어 테스트. 위 모바일 검증은 브라우저의 화면·터치 에뮬레이션입니다.
- 휴대폰 전화 앱에서 실제 통화 연결, Apple/Google 달력 앱의 일정 가져오기. 전화 링크와 ICS 파일 생성까지 확인했습니다.
- 외부 지도 앱에서의 실제 길찾기 및 앱 전환. 지도 검색 링크 구성까지 확인했습니다.
- 실제 GitHub Pages 원격 배포. 저장소 권한을 사용하지 않았으며 로컬 하위 경로에서 검증했습니다.
- 실제 스피커를 통한 주관적인 음악 청음. 브라우저 오디오 컨텍스트와 파형 출력은 확인했습니다.

초기 버전에서는 도로명 주소, 교통편, 주차 정보를 표시하지 않았으며 아래 후속 변경에서 추가했습니다. 개인 연락처와 계좌번호도 제공되지 않아 표시하지 않았습니다.

## 후속 수정

사용자 요청으로 ‘두 사람의 모습’ 섹션과 원본 그림 보기 창을 제거했습니다. 사진 15장 앨범은 유지했습니다. 위 원본 보기 검증은 제거 전 버전의 기록입니다. 제거 후 청첩장 표시, 앨범 열기, 재시작과 브라우저 오류 유무를 별도로 확인했습니다.

캐릭터 후속 변경: 머리가 큰 둥근 도트 캐릭터, 볼터치, 미소, 리본, 웨딩 꽃장식을 적용하고 동행 간격을 26픽셀로 조정했습니다. 화면에서 캐릭터와 목적지 표시를 확인했습니다.

## 제공된 MP3로 교체

배경음악을 사용자 제공 Our_Little_Story_8bit_Demo.mp3로 교체했습니다. 이전 Web Audio 합성곡 검증은 이전 버전 기록입니다. 새 파일과 원본의 SHA-256 일치를 확인했고, 미리보기에서 새 MP3 경로, 약 39.923초 길이, 반복 설정, 재생 상태 및 미디어 오류 없음(error=null)을 확인했습니다.

## 지도 및 교통 안내 후속 변경

공식 예식장 안내와 주소·교통·주차 내용을 대조했습니다. 인앱 미리보기에서 OpenStreetMap 지도와 마커, 출처 표시를 확인했습니다. 버튼은 작은 둥근 형태로, 교통 안내는 가는 구분선과 일반 본문 폰트로 정리하고 화면에서 확인했습니다. 카카오 SDK 경로는 키가 없어 실제 인증을 검증하지 않았습니다. 전체 게임 검사는 이 변경에 대해 재실행하지 않았습니다.

하단 후속 디자인: 사진 전체 보기와 링크 복사 버튼을 둥글게 변경하고, 다시 보기·음악 버튼을 두 열로 배치했습니다. 인앱 브라우저에서 최종 하단 배치를 시각 확인하고 관련 JavaScript 문법 검사를 통과했습니다.

사진첩 후속 디자인: 원형 화살표, 둥근 닫기 버튼과 연한 로즈색 하단 버튼을 적용했습니다. 인앱 브라우저에서 화면 및 다음 사진 전환(01 → 02)을 확인했습니다.

2026-09-24 카카오 지도 연결: 사용자 제공 JavaScript 키 적용 및 문법 검사 완료. SDK 응답이 401 domain mismatched(caller=http://127.0.0.1:4173)이므로 카카오 지도 실표시는 미완료. 인앱 브라우저에서 OpenStreetMap 대체 지도 표시 확인. 허용 도메인 등록 후 재확인 필요.

2026-09-24: 일정 저장 버튼과 클릭 핸들러를 제거하고 해당 다운로드 검사를 삭제했습니다. JavaScript 문법 검사 통과. 인앱 브라우저에서 저장 버튼 0개와 D-86 표시 및 둥근 배지 스타일을 확인했습니다. 이전 ICS 검증은 제거 전 기록입니다.

마음 전하기: 감사 문구 앞에 신랑·신부 계좌 아코디언 추가. 예금주는 청첩장 이름을 사용했습니다. 두 계좌 펼치기, 표시 및 클립보드에 복사된 번호가 제공 번호와 일치하는지 확인했습니다. JavaScript 문법 검사 통과.

2026-09-24 배포 후 개선: 제공된 7.23초 영상을 확인했습니다. 사진 전환의 반복 등장 애니메이션 제거, 인접 사진 사전 로딩 및 디코딩 후 교체, 비동기 응답 순서 보호, 세로 제스처 제외와 touchcancel 처리. 로컬 인앱에서 다음/다음/이전 후 02/15 및 정상 로딩 확인. 오디오 autoplay 속성 및 click 재시도 추가, 첫 조작 후 실제 playing 상태 확인. 실제 iPhone 무접촉 자동재생 및 터치 검증은 미실시. 배포 도메인 SDK는 재확인 시에도 401 domain mismatched를 반환. 원격 배포는 수행하지 않았습니다.

사진 기반 캐릭터: 세 의상의 걷기 미리보기를 실제 브라우저에서 시각 확인. draw()의 챕터 1~5 호출을 mock Canvas로 실행하여 캐릭터 의상 선택(1,1,2,3,3)을 검증했고 art.js 문법 검사 통과. 전체 게임 진행 검사는 이번 변경에서 반복하지 않았습니다.

신랑 도트 후속 수정: 솟은 정수리를 낮은 둥근 실루엣과 내려오는 앞머리로 변경. 01~02 안경은 눈을 가리지 않는 작은 테로 변경. 캐릭터 비교 화면과 실제 01 챕터에서 시각 확인, art.js 문법 검사 통과.

신랑 머리 가로 폭 후속 수정: 얼굴·머리만 가로 약 18% 축소하되 픽셀 경계를 정수로 유지했습니다. 몸과 이동 좌표 유지. 세 의상 비교 화면에서 시각 확인, 안경 위치를 눈 높이로 조정.

얼굴 재작성 후 턱·목·셔츠 경계 보완: 턱 아래 음영, 목 아래 음영과 셔츠 깃 추가. 세 의상 비교 미리보기에서 확인했습니다.

사용자 요청으로 사진 기반 캐릭터 변경을 취소하고 기존 배포본의 character()를 복원했습니다. 챕터별 사진 의상 분기를 제거하고 원래 마지막 장 웨딩 전환을 유지. 실제 게임에서 기본 캐릭터 표시 확인 및 문법 검사 통과.

의상 전용 변경 검증: 모든 의상에서 신랑·신부의 머리 영역(y<-15) 드로잉 명령이 기본 캐릭터와 동일함을 비교 통과. 예복 여부별로 각각 비교했습니다. 세 의상 걷기 미리보기 시각 확인 및 문법 검사 통과.

## 2026-09-24 corrected photo replacement
- Replaced all 15 album/treasure photos with newly supplied corrected images, matching existing scenes and IDs.
- Optimized to maximum 1600px, preserved aspect ratios and EXIF orientation; combined JPEG size 1.97 MiB.
- Added photo URL version 20260924b to refresh cached images.
- Browser verified all 15 thumbnails loaded, full-size first image displayed, next navigation changed 01/15 to 02/15.


## 2026-09-24 RSVP and Guest Book
See RSVP_RELEASE.md for the new checks. Four validation/statistics tests and 20 local PGlite SQL security checks passed. Browser success flows used a separate local test DB, while actual Supabase correctly reported missing schema. Real project writes and real administrator login remain pending SQL and UID setup. Existing invitation/account code, character renderer and original stylesheet have identical before/after SHA-256 hashes.


## 2026-09-24 Guild board and attendee drilldown
- Guest Book recent-three preview now uses a cream/pink village noticeboard with CSS pixel pins/corners. Header and explanatory text retained. Empty/loading/error states are inside the board. Long previews clamp to three lines; full view retains the full text. Reduced-motion is honored.
- RSVP existing name field is explicitly labelled required; dialogs reset scroll position on opening.
- Admin groom/bride attendee totals filter the already-authorized response list to attending guests only; all responses can be restored. No auth or query permission changes.
- Changed js/guestbook.js, js/admin.js, js/rsvp.js, js/wedding-forms.js, wedding-social.css, tests/wedding-forms.test.js; added js/attendance-filter.js.
- Five unit tests passed. Isolated browser fixture verified zero/one/two/three entries, Korean/English/emoji, long text preview versus full text, immediate creation/deletion refresh, 375px/430px/mobile and desktop width, groom/bride filtering and all-response reset. Production data was not modified.
- Supabase schema SHA-256 matches pre-change backup. No SQL or Supabase configuration changes required.

