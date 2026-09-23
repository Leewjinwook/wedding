# OUR LITTLE STORY

이진욱 ♥ 이세라의 모바일 픽셀 웨딩 게임 청첩장.
2026년 12월 19일 토요일 오전 11시 · 신도림 테크노마트 8층 웨딩시티 스타티스홀.

빌드나 서버 API 없이 작동하는 HTML/CSS/JavaScript 정적 프로젝트입니다.

## 실행

Node.js가 설치된 컴퓨터에서 이 폴더를 열고 다음을 실행합니다.

```sh
npm start
```

브라우저에서 http://127.0.0.1:4173/wedding/ 을 엽니다. `/wedding/`은 GitHub Pages 하위 경로와 같은 조건을 테스트하는 로컬 별칭입니다. 루트 `/`에서도 작동합니다.

Python이 설치되어 있으면 `python -m http.server 4173` 실행 후 http://localhost:4173/ 을 열어도 됩니다.

ES 모듈을 사용하므로 `index.html`을 더블클릭하는 `file://` 실행은 사용하지 마세요. Node는 개발 서버에만 사용되며 배포 후에는 필요하지 않습니다.

## 플레이

- 휴대폰: 표지판 또는 원하는 위치를 터치해서 이동 → 도착 후 큰 버튼으로 상호작용.
- 컴퓨터: 방향키/WASD 이동, Enter/Space 대화·상호작용. 버튼에 포커스가 있으면 해당 버튼이 작동합니다.
- 출력 중인 대사를 누르면 문장이 완성되고, 다시 누르면 이어집니다.
- 만남 후부터 신부가 신랑과 함께 이동합니다.
- 카페·꽃길·사진에서 하트 세 개를 모으면 다음 길이 열립니다.
- 인사, 추억 세 곳, 약속을 완료하면 총 다섯 보물상자가 나타납니다.
- 상자를 누르면 사진이 펼쳐집니다. 각 상자에 세 장, 총 15장입니다. 좌우 버튼·스와이프·키보드 방향키로 넘길 수 있습니다.
- 사진을 보는 동안 게임은 멈춥니다. 닫으면 이어집니다.
- 자동 진행은 사진도 순서대로 보여줍니다. 사진 넘김 버튼/스와이프를 사용하면 해당 사진첩의 자동 넘김만 멈춥니다. 닫으면 자동 이야기가 계속됩니다.
- 청첩장 바로 보기는 어느 장면에서든 사용할 수 있으며 사진 창에도 있습니다. 청첩장에서는 15장을 모두 볼 수 있습니다.
- 이야기 다시 보기는 위치, 하트, 보물상자, 자동 진행을 초기화합니다. 소리 선택은 유지됩니다.
- 음악은 최신 요청에 따라 **자동 재생을 시도**합니다. 브라우저가 차단하면 첫 터치/클릭/키 입력으로 재생됩니다. 게임 및 청첩장에 음소거 버튼이 있습니다.

## GitHub Pages 배포

이 폴더 **안의 파일과 폴더**를 개인 GitHub 저장소 최상위에 올립니다. `index.html`이 저장소 루트에 있어야 합니다.

1. 저장소에서 **Settings → Pages**를 엽니다.
2. **Build and deployment → Source → Deploy from a branch**를 선택합니다.
3. **main / (root)**를 선택하고 **Save**를 누릅니다.
4. 배포가 끝나면 Pages에 표시된 `https://사용자명.github.io/저장소명/` 주소를 사용합니다.

별도 빌드 단계, 환경 변수, 비밀키가 없습니다. `.nojekyll`도 포함해 업로드하세요. 모든 프로젝트 자산은 상대 경로를 사용하므로 저장소 이름을 바꾸어도 됩니다. 기존 저장소에 합칠 때에는 기존 파일을 덮어쓰지 않도록 전용 폴더/저장소를 선택하세요.

공식 안내: [GitHub Pages 게시 소스 설정](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site), [정적 사이트 만들기](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site).

이 결과물은 다른 호스팅에 게시되지 않았으며 GitHub 업로드도 실행하지 않았습니다.

## 내용 수정

`js/config.js`에서 아래 내용을 바꿉니다.

| 설정 | 내용 |
| --- | --- |
| `groom`, `bride` | 신랑·신부 이름 |
| `groomParents`, `brideParents` | 혼주 성함 |
| `date` | 예식 시각. 한국 시간대 `+09:00` 유지 |
| `venue`, `hall`, `phone`, `mapQuery` | 장소, 홀, 전화, 지도 검색어 |
| `address`, `transport`, `parking` | 예식장 공식 안내를 반영한 주소·교통·주차 정보 |
| `contacts`, `accounts` | 실제 개인 연락처/계좌를 나중에 추가. 빈 배열이면 숨김 |
| `text` | 타이틀 소개, 초대 문구, 챕터 제목·대사 |
| `photos` | 사진 번호, 상대 경로, 대체 텍스트 |
| `treasures` | 목표별 보물상자 이름과 사진 번호 |
| `originals` | 원본 그림 경로와 설명 |
| `music` | MP3 경로, 음량(0~1), 자동 재생 여부 |

날짜를 바꾸면 달력, 한국 시간 기준 D-Day, 예식 일시, 바닥글 날짜가 함께 바뀝니다. 검색 설명(`index.html`의 description)은 공유 문구로 별도 확인해 주세요. 자잘한 조작 안내와 버튼 이름은 해당 UI 모듈에 있습니다.

## 사진·에셋 교체

- `assets/photos/`에 모바일용 사진을 넣고 `photos`에 등록합니다. 권장 긴 변 1600px 내외, JPEG/WebP. 가로·세로 모두 전체 비율로 표시됩니다.
- 15개 모바일용 사진은 제공된 파일에서 리사이즈/압축한 사본입니다. 색 보정, 얼굴 수정, 자르기는 하지 않았습니다. 원본 파일은 변경하지 않았습니다.
- 원래 파일명과 사본 매핑은 `assets/photos/manifest.json`에 있습니다.
- `assets/invitation-ribbon.jpg`, `assets/invitation-couple.jpg`는 원본을 바이트 그대로 복사한 파일입니다. 요청에 따라 ‘두 사람의 모습’ 섹션은 제거했으며, 원본 파일은 프로젝트 자산으로 보관합니다.
- `js/art.js`: 직접 만든 픽셀 캐릭터, 마을, 소품, 웨딩 의상, 보물상자. Canvas 정수 좌표로 그립니다.
- `assets/audio/our-little-story.mp3`: 사용자가 제공한 **Our_Little_Story_8bit_Demo.mp3**를 그대로 복사했습니다. `js/audio.js`에서 반복 재생하며 탭을 벗어나면 일시 정지합니다. 원래 합성 배경음은 제거했습니다.
- `assets/fonts/Jua-Regular.ttf`: 둥글고 귀여운 주아(Jua) 로컬 웹폰트. `Jua-OFL.txt` 라이선스도 함께 유지하세요.

## 코드 구조

```text
index.html             게임 화면
style.css              모바일 반응형 레이아웃, 주아 폰트, 사진 등장 효과
js/config.js           예식 정보, 문구, 사진·보물상자 구성
js/game.js             이동, 동행, 대화, 목표, 자동 진행, 초기화
js/art.js              Canvas 픽셀 드로잉
js/gallery.js          보물상자 사진 보기, 넘김, 자동 감상
js/invitation.js       HTML 청첩장, 달력, D-Day, ICS, 링크 복사
js/audio.js            제공된 MP3 반복 재생과 음악 제어
js/app.js              게임과 청첩장 연결
assets/                원본 그림, 모바일 사진, 폰트
serve.mjs              로컬 확인용 정적 서버
tests/browser.cjs      실제 브라우저 기반 기능 검증
```

## 검증 다시 실행

별도 터미널에서 `npm start`를 실행한 상태로:

```sh
npm install --no-save playwright
npx playwright install chromium
npm test
```

이미 Edge가 설치된 Windows에서는 PowerShell에서 `$env:BROWSER_CHANNEL='msedge'`를 설정하면 Chromium 다운로드 없이 Edge를 사용할 수 있습니다. 결과는 `test-results/`에 생성됩니다. 라이브 사이트에는 테스트 패키지를 업로드할 필요가 없습니다.

검증 범위와 남은 실제 기기 확인 항목은 `VERIFICATION.md`에 기록합니다.

## 라이선스와 외부 연결

- 사진·그림: 사용자가 제공한 파일입니다.
- 픽셀 드로잉·코드: 이 프로젝트를 위해 제작했습니다. 배경음악은 사용자가 제공한 MP3입니다.
- Neo둥근모: Eunbin Jeong (Dalgona.), SIL Open Font License 1.1. [공식 배포처](https://github.com/neodgm/neodgm-webfont). 전문은 `assets/fonts/LICENSE.txt`에 포함됩니다.
- 폰트·사진·음악은 로컬 자산입니다. 내장 지도는 OpenStreetMap을 네트워크로 불러오며, 지도 버튼은 네이버/카카오 지도로 연결합니다.
- 자동 재생은 [브라우저의 Web Audio 자동 재생 정책](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay)을 따릅니다. 모바일 브라우저에서 무조건 무접촉 소리 재생을 보장할 수는 없습니다.

현재 표시 폰트: Jua(주아), SIL Open Font License 1.1. 공식 배포: https://github.com/google/fonts/tree/main/ofl/jua . 이전 Neo둥근모 파일은 보관되어 있지만 화면에서는 사용하지 않습니다.

## 오시는 길 지도

주소·교통·주차는 [예식장 공식 안내](https://www.tmwedding.co.kr/location)를 반영했습니다. 버스 노선은 접어서 표시합니다.
현재 사용자 제공 JavaScript 키로 카카오 지도를 우선 불러옵니다. 인증 또는 로딩 실패 시 OpenStreetMap iframe으로 건물 위치를 표시합니다.
카카오 지도를 쓰려면 `js/config.js`의 `map.kakaoJavaScriptKey`에 JavaScript 키를 입력하고 카카오 개발자 콘솔에서 사용할 웹 도메인을 등록하세요. REST API 키나 Admin 키를 넣지 마세요. SDK 로딩 실패 시 기본 지도로 돌아갑니다. 지도 제공자 네트워크 장애 시 외부 지도 링크를 사용할 수 있습니다.

2026-09-24: 제공된 JavaScript 키를 연결했습니다. 로컬 확인 주소 `http://127.0.0.1:4173`에 대해 카카오가 `401 domain mismatched`를 반환했습니다. 이 주소를 카카오 웹 허용 도메인에 등록해야 합니다. 실제 배포 시 배포 도메인도 등록하세요.

사용자 요청으로 달력에 일정 저장 버튼을 제거했습니다. D-Day는 연한 로즈색의 둥근 배지로 표시합니다.

배포 주소: https://leewjinwook.github.io/wedding/ . 카카오 웹 허용 도메인은 https://leewjinwook.github.io 입니다. 2026-09-24 수정본은 로컬 파일이며 GitHub에 업로드해야 배포 사이트에 반영됩니다. 음악은 접속 시 재생 시도, 브라우저가 차단하면 첫 터치/클릭에서 재시도합니다. 사진은 인접 사진을 미리 읽고 디코딩 완료 후 교체합니다.

캐릭터는 사용자 요청으로 사진 기반 변경 전의 기본 도트로 복원했습니다. 마지막 웨딩 장면의 기존 예복 전환은 유지합니다.

최신 의상 변경: 기본 얼굴·머리·체형을 유지하고 01~02 남색/회색 재킷, 03 청재킷, 04~05 갈색 정장/흰 드레스·노란 부케를 적용했습니다. 마지막 장의 기존 베일과 머리 장식은 유지합니다.

## 참석 응답 및 방명록 추가
설정 순서와 관리자 계정 생성은 [SUPABASE_SETUP.md](./SUPABASE_SETUP.md), 변경 내역과 검증 한계는 [RSVP_RELEASE.md](./RSVP_RELEASE.md)를 확인하세요. SQL 실행과 관리자 UID 등록 후 GitHub에 새 파일을 업로드해야 동작합니다.

