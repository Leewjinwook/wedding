// 모든 예식 정보와 화면 문구. 미제공 항목은 빈 값으로 두면 표시하지 않습니다.
export const CONFIG = {
  groom: '이진욱', bride: '이세라',
  groomParents: ['이춘목', '이미경'], brideParents: ['이종재', '이미애'],
  date: '2026-12-19T11:00:00+09:00',
  venue: '신도림 테크노마트 8층 웨딩시티', hall: '스타티스홀', phone: '02-2111-8888',
  mapQuery: '신도림 웨딩시티',
  music: { src: './assets/audio/our-little-story.mp3', volume: 0.65, autoplay: true }, // 자동 재생 시도. 브라우저가 막으면 첫 터치에서 시작.
  address: '서울특별시 구로구 새말로 97',
  transport: '1·2호선 신도림역 3번 출구 방향에서 테크노마트 판매동 지하 1층으로 바로 연결됩니다.',
  parking: '테크노마트 지하주차장 B3~B7을 이용해 주세요. 주차요원의 안내를 따라 주세요.',
  locationSource: 'https://www.tmwedding.co.kr/location',
  map: { latitude: 37.5070089, longitude: 126.8902959, kakaoJavaScriptKey: 'c2a062b16d86ede9b08b5256d102de7f' },
  // 기본은 OpenStreetMap. 카카오 JavaScript 키와 허용 도메인 설정 시 카카오 지도 사용.
  buses: [
    { stop: '신도림역 (17-102)', direction: '신도림역 3번 출구 쪽', routes: [
      ['지선', '5619, 6411, 6511, 6611'], ['직행', '5200'], ['마을', '영등포09, 영등포12, 영등포13']
    ] },
    { stop: '신도림역 (17-001)', direction: '신도림역 1번 출구 쪽. 하차 후 지하보도로 3번 출구 방향으로 이동하여 테크노마트 판매동 지하 1층 통로를 이용해 주세요.', routes: [
      ['간선', '160, 503, 600, 660, 662'], ['지선', '5615, 5714, 6512, 6515, 6516, 6637, 6640A, 6713'], ['직행', '301, 320'], ['일반', '10, 11-1, 11-2, 83, 88, 530'], ['공항', '6018']
    ] }
  ],
  contacts: [], // 예: { label: '신랑에게 연락하기', phone: '실제 전화번호' }
  accounts: [
    { label: '신랑', bank: '토스뱅크', number: '1000-0892-5960', holder: '이진욱' },
    { label: '신랑 아버지', bank: 'KB국민은행', number: '837601-04-108455', holder: '이춘목' },
    { label: '신랑 어머니', bank: 'IBK기업은행', number: '149-00606-703-018', holder: '이미경' },
    { label: '신부', bank: '카카오뱅크', number: '7942-29-07510', holder: '이세라' },
    { label: '신부 아버지', bank: '농협은행', number: '352-0522-4538-53', holder: '이종재' },
    { label: '신부 어머니', bank: '우체국', number: '100479-02-168060', holder: '이미애' }
  ],
  photos: [
    { id: 1, src: './assets/photos/photo-01.jpg?v=20260924b', alt: '노란 꽃다발과 반지 상자를 든 두 사람' },
    { id: 2, src: './assets/photos/photo-02.jpg?v=20260924b', alt: '색색의 리본 속에서 웃는 두 사람' },
    { id: 3, src: './assets/photos/photo-03.jpg?v=20260924b', alt: '하트 풍선을 들고 서로 바라보는 두 사람' },
    { id: 4, src: './assets/photos/photo-04.jpg?v=20260924b', alt: '거울 앞에서 컵케이크를 든 두 사람' },
    { id: 5, src: './assets/photos/photo-05.jpg?v=20260924b', alt: '노란 꽃다발을 든 신부와 반지 상자를 든 신랑' },
    { id: 6, src: './assets/photos/photo-06.jpg?v=20260924b', alt: '거울에 결혼 날짜를 쓰는 두 사람' },
    { id: 7, src: './assets/photos/photo-07.jpg?v=20260924b', alt: '흰 꽃다발을 든 신부의 모습을 담는 신랑' },
    { id: 8, src: './assets/photos/photo-08.jpg?v=20260924b', alt: '선글라스와 레이스를 맞춰 쓴 두 사람' },
    { id: 9, src: './assets/photos/photo-09.jpg?v=20260924b', alt: '검은 턱시도 차림으로 꽃다발을 든 신랑' },
    { id: 10, src: './assets/photos/photo-10.jpg?v=20260924b', alt: '붉은 리본을 나란히 든 신랑과 신부' },
    { id: 11, src: './assets/photos/photo-11.jpg?v=20260924b', alt: '컵케이크를 들고 눈을 맞추는 두 사람' },
    { id: 12, src: './assets/photos/photo-12.jpg?v=20260924b', alt: '흰 소파에 앉아 미소 짓는 신부' },
    { id: 13, src: './assets/photos/photo-13.jpg?v=20260924b', alt: '창가에서 서로를 바라보는 두 사람' },
    { id: 14, src: './assets/photos/photo-14.jpg?v=20260924b', alt: '하트 풍선을 들고 손을 잡은 두 사람' },
    { id: 15, src: './assets/photos/photo-15.jpg?v=20260924b', alt: '12와 19 숫자 풍선을 든 두 사람' }
  ],
  treasures: {
    meet: { title: '너라는 선물', photos: [9, 12, 13] },
    cafe: { title: '함께 웃는 날들', photos: [4, 6, 11] },
    flowers: { title: '나란히 걷는 우리', photos: [3, 8, 14] },
    photo: { title: '오래 간직할 순간', photos: [2, 7, 10] },
    promise: { title: '우리의 다음 페이지', photos: [1, 5, 15] }
  },
  originals: [
    { src: './assets/invitation-ribbon.jpg', alt: '붉은 리본을 든 신랑과 신부, 원본 그림 전체' },
    { src: './assets/invitation-couple.jpg', alt: '손을 잡은 신랑과 신부, 원본 그림 전체' }
  ],
  text: {
    title: 'OUR LITTLE STORY',
    titleIntro: '서로 다른 길을 걷던 우리가\n하나의 이야기가 되기까지',
    invitation: '서로 모르고 지냈던 우리가 만나\n이제 평생의 서로 편이 되려 합니다.\n\n저희의 새로운 시작에 함께해 주세요.',
    chapters: ['서로 다른 하루', '너를 만난 날', '함께하는 하루', '앞으로도, 함께', '우리의 새로운 시작'],
    subtitles: ['각자의 작은 일상에서, 이야기의 첫걸음', '꽃길 끝에서 마주친 새로운 인연', '둘이어서 더 반짝이는 평범한 순간들', '앞으로의 계절을 약속하며', '끝이 아닌, 우리만의 새로운 시작'],
    daily: '같은 세상 속, 아직은 서로를 몰랐던 두 사람.',
    greeting: ['안녕! 만나서 반가워.', '평범했던 하루에, 특별한 사람이 찾아왔습니다.'],
    memories: ['함께 웃는 날이 늘어나고', '평범한 하루가 추억이 되고', '어느새 서로의 가장 가까운 사람이 되었습니다.'],
    proposal: '앞으로의 모든 계절도 함께할래?',
    acceptance: '함께할게. 우리, 언제나 같은 편이 되자.',
    ending: ['서로 모르고 지냈던 우리가 만나', '이제는 평생을 함께할 서로의 편이 되려 합니다.'],
    symbolic: '두 사람의 이야기는 여기서 끝나지 않습니다.\n이제, 평생을 함께하는 새로운 모험이 시작됩니다.'
  }
};
