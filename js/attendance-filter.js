export function filterAttendance(rows, side = 'all') {
  if (!['groom', 'bride'].includes(side)) return rows;
  return rows.filter(row => row.side === side && row.attendance_status === 'attending');
}
