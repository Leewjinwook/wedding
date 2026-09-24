import test from 'node:test';
import assert from 'node:assert/strict';
import { attendanceInput, guestbookInput, summarize } from '../js/wedding-forms.js';
import { filterAttendance } from '../js/attendance-filter.js';
const base = {name:'하객',side:'groom',attendance_status:'attending',guest_count:'2',meal_status:'yes',message:''};
test('attendance limits and required categories',()=>{
  assert.equal(attendanceInput(base).guest_count,2);
  for(const guest_count of ['0','21','1.5','NaN'])assert.throws(()=>attendanceInput({...base,guest_count}));
  for(const side of ['', 'admin'])assert.throws(()=>attendanceInput({...base,side}));
  assert.throws(()=>attendanceInput({...base,name:' '.repeat(5)}));
  assert.throws(()=>attendanceInput({...base,message:'가'.repeat(301)}));
});
test('nonattendance never carries stale meal or guest count',()=>{
  const row=attendanceInput({...base,attendance_status:'not_attending',guest_count:20,meal_status:'yes'});
  assert.equal(row.guest_count,0);assert.equal(row.meal_status,'not_applicable');
});
test('guestbook validation includes bcrypt byte limit',()=>{
  const row={name:'하객',message:'축하해요',password:'abcdef'};
  assert.equal(guestbookInput(row).p_message,'축하해요');
  for(const password of ['12345',' '.repeat(6),'한'.repeat(25),'a'.repeat(65)])assert.throws(()=>guestbookInput({...row,password}));
  assert.throws(()=>guestbookInput({...row,message:' '.repeat(10)}));
  assert.throws(()=>guestbookInput({...row,message:'a'.repeat(301)}));
});
test('stats count people rather than number of attending replies',()=>{
  const rows=[attendanceInput(base),attendanceInput({...base,side:'bride',guest_count:3,meal_status:'undecided'}),attendanceInput({...base,attendance_status:'not_attending'})];
  assert.deepEqual(summarize(rows),[3,5,1,2,3,2]);
});
test('side attendee drilldown excludes declines and preserves companion counts',()=>{
  const rows=[attendanceInput(base),attendanceInput({...base,name:'신부 하객',side:'bride',guest_count:3}),attendanceInput({...base,name:'불참 하객',attendance_status:'not_attending'})];
  assert.equal(filterAttendance(rows,'all').length,3);
  assert.deepEqual(filterAttendance(rows,'groom').map(row=>[row.name,row.guest_count]),[['하객',2]]);
  assert.deepEqual(filterAttendance(rows,'bride').map(row=>[row.name,row.guest_count]),[['신부 하객',3]]);
  assert.deepEqual(filterAttendance([],'groom'),[]);
});
