import { supabase } from '../supabaseClient';

export async function getSupplements(userId) {
  const { data, error } = await supabase
    .from('user_supplements')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data;
}

export async function addSupplement(userId, supplement) {
  const { data, error } = await supabase
    .from('user_supplements')
    .insert({
      user_id: userId,
      supplement_id: supplement.id,
      name: supplement.name,
      emoji: supplement.emoji,
      time_group: supplement.defaultGroup,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function removeSupplement(userId, supplementId) {
  const { error } = await supabase
    .from('user_supplements')
    .delete()
    .eq('user_id', userId)
    .eq('supplement_id', supplementId);
  if (error) throw error;
}

export async function logSupplementIntake(userId, supplementId, date) {
  const { data, error } = await supabase
    .from('supplement_logs')
    .insert({
      user_id: userId,
      supplement_id: supplementId,
      taken_at: date ?? new Date().toISOString(),
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getSupplementLogs(userId, date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  const { data, error } = await supabase
    .from('supplement_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('taken_at', start.toISOString())
    .lte('taken_at', end.toISOString());
  if (error) throw error;
  return data;
}

export async function deleteSupplementLog(logId) {
  const { error } = await supabase
    .from('supplement_logs')
    .delete()
    .eq('id', logId);
  if (error) throw error;
}
