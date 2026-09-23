import { saveAttendance, errorMessage } from './wedding-api.js';
import { makeDialog, formData, attendanceInput, nameField, messageField, honeypot } from './wedding-forms.js';

export function mountRSVP(root) {
  const section = document.createElement('section');
  section.className = 'invite-section wedding-social';
  section.innerHTML = '<span class="kicker">BE PART OF OUR STORY</span><h2>참석 의사 전달</h2><p>신랑, 신부에게 참석 의사를<br>미리 전달할 수 있어요.</p><button class="w-button" id="open-rsvp">참석 의사 전달하기</button><p class="w-status" role="status" aria-live="polite"></p>';
  root.append(section);
  const modal = makeDialog('참석 의사 전달', `<form id="rsvp-form">${nameField}<label>어느 쪽 하객이신가요?<select name="side" required><option value="">선택해 주세요</option><option value="groom">신랑측</option><option value="bride">신부측</option></select></label><label>참석 여부<select name="attendance_status" required><option value="">선택해 주세요</option><option value="attending">참석</option><option value="not_attending">불참</option></select></label><fieldset class="w-attending" hidden disabled><legend>참석 안내</legend><label>참석 인원 (본인 포함)<input name="guest_count" type="number" min="1" max="20" step="1" value="1" required inputmode="numeric"></label><label>식사 여부<select name="meal_status" required><option value="">선택해 주세요</option><option value="yes">모두 식사해요</option><option value="no">식사하지 않아요</option><option value="undecided">아직 미정이에요</option></select></label><small>동행인과 식사 여부가 다르면 메시지에 남겨 주세요.</small></fieldset>${messageField}${honeypot}<p class="w-help">응답은 신랑·신부만 확인하며, 예식 인원 확인에 사용됩니다.</p><p class="w-error" role="alert"></p><button class="w-button" type="submit">참석 의사 전달</button></form>`);
  const form = modal.dialog.querySelector('form'), error = form.querySelector('.w-error');
  let busy = false, requestId = crypto.randomUUID(), lastSent = 0;
  const update = () => { const fields = form.querySelector('fieldset'); fields.hidden = fields.disabled = form.elements.attendance_status.value !== 'attending'; };
  form.elements.attendance_status.addEventListener('change', update);
  section.querySelector('button').onclick = () => { error.textContent = ''; modal.open(); };
  form.addEventListener('submit', async event => {
    event.preventDefault(); if (busy || !form.reportValidity()) return;
    const values = formData(form); error.textContent = '';
    if (values.website || Date.now() - lastSent < 15000) { error.textContent = '잠시 후 다시 전달해 주세요.'; return; }
    let row;
    try { row = attendanceInput(values); } catch (e) { error.textContent = e.message; return; }
    busy = true; modal.busy(true);
    const submit = form.querySelector('[type=submit]'); submit.disabled = true; submit.textContent = '전달하는 중…';
    try {
      await saveAttendance({ id: requestId, ...row });
      lastSent = Date.now(); requestId = crypto.randomUUID(); form.reset(); update(); modal.close();
      section.querySelector('.w-status').textContent = '참석 의사가 전달되었습니다. 감사합니다 💌';
    } catch (e) { error.textContent = errorMessage(e); }
    finally { busy = false; modal.busy(false); submit.disabled = false; submit.textContent = '참석 의사 전달'; }
  });
}
