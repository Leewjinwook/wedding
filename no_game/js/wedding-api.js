import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase-config.js';

let clientPromise;
// Loaded only when needed: a CDN/network failure cannot stop the story, music or invitation.
export function getClient() {
  if (!clientPromise) clientPromise = import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.57.4/+esm')
    .then(({ createClient }) => createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: true, detectSessionInUrl: false },
      global: { fetch: (url, options = {}) => fetch(url, { ...options, signal: AbortSignal.timeout(15000) }) }
    })).catch(error => { clientPromise = null; throw error; });
  return clientPromise;
}
export async function rpc(name, parameters = {}) {
  const { data, error } = await (await getClient()).rpc(name, parameters);
  if (error) throw error;
  return data;
}
export async function saveAttendance(row) {
  const { error } = await (await getClient()).from('attendance').insert(row);
  // A retry after a lost response reuses the UUID: only one row is saved.
  if (error && error.code !== '23505') throw error;
}
export function errorMessage(error) {
  if (['42P01','42883','PGRST202','PGRST205'].includes(error?.code)) return '아직 접수 준비 중이에요. 잠시 후 다시 이용해 주세요.';
  if (['42501','PGRST301'].includes(error?.code)) return '접수 연결을 확인하고 있어요. 잠시 후 다시 시도해 주세요.';
  if (['23514','22023','23502'].includes(error?.code)) return '입력한 이름, 인원과 메시지를 다시 확인해 주세요.';
  return '연결이 원활하지 않아요. 입력 내용은 유지되니 잠시 후 다시 시도해 주세요.';
}
