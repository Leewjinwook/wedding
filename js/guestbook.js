import { rpc, errorMessage } from './wedding-api.js';
import { makeDialog, formData, guestbookInput, nameField, honeypot } from './wedding-forms.js';

export function mountGuestbook(root) {
  const section = document.createElement('section'); section.className = 'invite-section wedding-social guild-section';
  section.innerHTML = '<span class="kicker">WORDS TO TREASURE</span><h2>Guest Book</h2><p>두 사람의 이야기에<br>따뜻한 한마디를 남겨 주세요.</p><div class="guild-board" role="region" aria-label="최근 축하 메시지 게시판"><div class="guild-board-label"><span aria-hidden="true">✦</span> GUILD MESSAGE BOARD <span aria-hidden="true">✦</span></div><div class="w-entries" aria-live="polite"></div><p class="w-status" role="status">마음을 불러오는 중…</p><button class="w-button w-secondary" id="retry-guestbook" hidden>다시 불러오기</button><p class="guild-board-foot">우리의 모험에 남겨 주신 소중한 마음</p></div><button class="w-button" id="write-guestbook">방명록 작성하기</button><button class="w-button w-secondary" id="all-guestbook">방명록 전체보기</button>';
  root.append(section);
  const status = section.querySelector('.w-status'), preview = section.querySelector('.w-entries'), retry = section.querySelector('#retry-guestbook');
  const all = makeDialog('우리에게 남겨 주신 마음', '<div class="w-all-entries"></div><p class="w-status" role="status"></p><button class="w-button w-secondary" id="more-guestbook">더 보기</button>');
  const list = all.dialog.querySelector('.w-all-entries'), listStatus = all.dialog.querySelector('.w-status'), more = all.dialog.querySelector('button#more-guestbook');
  let offset = 0, loadingAll = false, listVersion = 0, previewVersion = 0;
  const deletion = makeDialog('방명록 삭제', '<form><p>작성할 때 입력한 비밀번호를 입력해주세요.</p><label>삭제 비밀번호<input name="password" type="password" required maxlength="64" autocomplete="off"></label><p class="w-error" role="alert"></p><button class="w-button" type="submit">삭제하기</button></form>');
  let deleteId, deleting = false;
  function cards(container, rows, append = false) {
    if (!append) container.replaceChildren();
    for (const row of rows) {
      const card = document.createElement('article'); card.className = 'w-entry';
      const header = document.createElement('div'), author = document.createElement('strong'), date = document.createElement('time'), message = document.createElement('p'), remove = document.createElement('button');
      author.textContent = row.name;
      date.dateTime = row.created_at; date.textContent = new Intl.DateTimeFormat('ko-KR', { timeZone:'Asia/Seoul', year:'numeric', month:'2-digit', day:'2-digit' }).format(new Date(row.created_at));
      message.textContent = row.message; remove.textContent = '×'; remove.type = 'button'; remove.className = 'w-delete'; remove.setAttribute('aria-label', row.name + '님의 방명록 삭제');
      remove.onclick = () => { deleteId = row.id; deletion.dialog.querySelector('form').reset(); deletion.dialog.querySelector('.w-error').textContent = ''; deletion.open(); };
      header.append(author, date, remove); card.append(header, message); container.append(card);
    }
  }
  async function loadPreview() {
    const version = ++previewVersion; retry.hidden = true; status.textContent = '마음을 불러오는 중…';
    try {
      const rows = await rpc('list_guestbook', { p_limit:3, p_offset:0 });
      if (version !== previewVersion) return;
      cards(preview, rows); status.textContent = rows.length ? '' : '아직 등록된 메시지가 없습니다.\n첫 번째 축하 메시지를 남겨주세요 ♡';
    } catch (e) { if (version !== previewVersion) return; status.textContent = errorMessage(e); retry.hidden = false; }
  }
  async function loadAll(reset = false) {
    if (loadingAll && !reset) return;
    const version = ++listVersion; loadingAll = true;
    if (reset) { offset = 0; list.replaceChildren(); }
    more.hidden = false; more.disabled = true; listStatus.textContent = '불러오는 중…';
    try {
      const rows = await rpc('list_guestbook', { p_limit:20, p_offset:offset });
      if (version !== listVersion) return;
      // Avoid duplicates when a new public entry shifts an offset between requests.
      const existing = new Set([...list.children].map(card => card.dataset.id));
      const fresh = rows.filter(row => !existing.has(row.id));
      const before = list.children.length; cards(list, fresh, true);
      fresh.forEach((row, i) => { list.children[before+i].dataset.id = row.id; });
      offset += rows.length; more.hidden = rows.length < 20; listStatus.textContent = offset ? '' : '아직 남겨진 마음이 없어요.';
    } catch (e) { if (version === listVersion) { listStatus.textContent = errorMessage(e); more.textContent = '다시 불러오기'; } }
    finally { if (version === listVersion) { loadingAll = false; more.disabled = false; } }
  }
  retry.onclick = loadPreview;
  section.querySelector('#all-guestbook').onclick = () => { all.open(); more.textContent = '더 보기'; loadAll(true); };
  more.onclick = () => loadAll();
  const write = makeDialog('두 사람에게 한마디', `<form>${nameField}<label>축하 메시지 <span>(최대 300자)</span><textarea name="message" rows="5" required maxlength="300" placeholder="소중히 간직할게요 ♡"></textarea></label><label>삭제용 비밀번호<input name="password" type="password" required minlength="6" maxlength="64" autocomplete="new-password" placeholder="6~64자"></label><small>삭제할 때 필요해요. 다른 서비스의 비밀번호는 쓰지 마세요.</small>${honeypot}<p class="w-help">이름과 메시지는 청첩장에 공개됩니다.</p><p class="w-error" role="alert"></p><button class="w-button" type="submit">마음 남기기</button></form>`);
  const form = write.dialog.querySelector('form'); let writing = false, requestId = crypto.randomUUID(), lastSent = 0;
  section.querySelector('#write-guestbook').onclick = () => { form.querySelector('.w-error').textContent = ''; write.open(); };
  form.addEventListener('submit', async event => {
    event.preventDefault(); if (writing || !form.reportValidity()) return;
    const error = form.querySelector('.w-error'), values = formData(form); error.textContent = '';
    if (values.website || Date.now() - lastSent < 15000) { error.textContent = '잠시 후 다시 남겨 주세요.'; return; }
    let input; try { input = guestbookInput(values); } catch (e) { error.textContent = e.message; return; }
    const submit = form.querySelector('[type=submit]'); writing = true; write.busy(true); submit.disabled = true; submit.textContent = '남기는 중…';
    try {
      await rpc('create_guestbook', { ...input, p_request_id:requestId });
      requestId = crypto.randomUUID(); lastSent = Date.now(); form.reset(); write.close(); await loadPreview();
    } catch (e) { error.textContent = errorMessage(e); }
    finally { writing = false; write.busy(false); submit.disabled = false; submit.textContent = '마음 남기기'; }
  });
  deletion.dialog.querySelector('form').addEventListener('submit', async event => {
    event.preventDefault(); if (deleting) return;
    const f = event.currentTarget, error = f.querySelector('.w-error'), submit = f.querySelector('[type=submit]');
    if (!f.reportValidity()) return;
    deleting = true; deletion.busy(true); submit.disabled = true; error.textContent = '';
    try {
      const result = await rpc('delete_guestbook', { p_id:deleteId, p_password:f.elements.password.value });
      if (result === 'wrong_password') error.textContent = '비밀번호가 일치하지 않습니다.';
      else if (result === 'locked') error.textContent = '시도 횟수가 많아요. 5분 후 다시 시도해 주세요.';
      else { deletion.close(); f.reset(); await loadPreview(); if (all.dialog.open) await loadAll(true); }
    } catch (e) { error.textContent = errorMessage(e); }
    finally { deleting = false; deletion.busy(false); submit.disabled = false; }
  });
  const observer = new IntersectionObserver(entries => { if (entries.some(entry => entry.isIntersecting)) { observer.disconnect(); section.querySelector('.guild-board').classList.add('guild-visible'); loadPreview(); } });
  observer.observe(section);
}
