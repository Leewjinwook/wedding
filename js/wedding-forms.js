export const MAX_GUESTS = 20;
export function validText(value, max) {
  return typeof value === 'string' && value.trim().length > 0 && [...value.trim()].length <= max;
}
export function attendanceInput(values) {
  const name = values.name?.trim();
  const message = values.message?.trim() || '';
  const attending = values.attendance_status === 'attending';
  const count = attending ? Number(values.guest_count) : 0;
  const meal = attending ? values.meal_status : 'not_applicable';
  if (!validText(name, 30) || !['groom','bride'].includes(values.side) ||
      !['attending','not_attending'].includes(values.attendance_status) || [...message].length > 300 ||
      (attending && (!Number.isInteger(count) || count < 1 || count > MAX_GUESTS || !['yes','no','undecided'].includes(meal)))) {
    throw new Error('이름, 참석 구분, 인원(1~20명), 식사 여부를 확인해 주세요.');
  }
  return { name, side: values.side, attendance_status: values.attendance_status, guest_count: count, meal_status: meal, message };
}
export function guestbookInput(values) {
  if (!validText(values.name, 30) || !validText(values.message, 300) || typeof values.password !== 'string' ||
      values.password.length < 6 || values.password.length > 64 || new TextEncoder().encode(values.password).length > 72 || !values.password.trim()) {
    throw new Error('이름과 메시지(최대 300자), 삭제 비밀번호(6~64자, 한글 포함 최대 72바이트)를 확인해 주세요.');
  }
  return { p_name: values.name.trim(), p_message: values.message.trim(), p_password: values.password };
}
export function summarize(rows) {
  const attending = rows.filter(row => row.attendance_status === 'attending');
  const sum = list => list.reduce((total, row) => total + row.guest_count, 0);
  return [rows.length, sum(attending), rows.length - attending.length,
    sum(attending.filter(row => row.side === 'groom')), sum(attending.filter(row => row.side === 'bride')),
    sum(attending.filter(row => row.meal_status === 'yes'))];
}
export function makeDialog(title, content) {
  const dialog = document.createElement('dialog');
  dialog.className = 'wedding-dialog';
  const id = 'wedding-dialog-' + crypto.randomUUID();
  dialog.setAttribute('aria-labelledby', id);
  // All markup here is developer-authored; visitor values are rendered with textContent.
  dialog.innerHTML = `<header><h2 id="${id}"></h2><button type="button" class="w-close" aria-label="닫기">×</button></header>${content}`;
  dialog.querySelector('h2').textContent = title;
  document.body.append(dialog);
  let opener, previousOverflow, busy = false;
  dialog.querySelector('.w-close').onclick = () => { if (!busy) dialog.close(); };
  dialog.addEventListener('cancel', event => { if (busy) event.preventDefault(); });
  dialog.addEventListener('close', () => { document.body.style.overflow = previousOverflow; opener?.focus(); });
  return {
    dialog,
    open() { opener = document.activeElement; previousOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden'; dialog.showModal(); },
    close() { dialog.close(); },
    busy(value) { busy = value; dialog.querySelector('.w-close').disabled = value; }
  };
}
export function formData(form) { return Object.fromEntries(new FormData(form)); }
export const nameField = '<label>이름<input name="name" autocomplete="name" required maxlength="30" placeholder="성함을 적어 주세요"></label>';
export const messageField = '<label>전달 메시지 <span>(선택 · 최대 300자)</span><textarea name="message" rows="3" maxlength="300"></textarea></label>';
export const honeypot = '<label class="w-honey" aria-hidden="true">Website<input name="website" tabindex="-1" autocomplete="off"></label>';
