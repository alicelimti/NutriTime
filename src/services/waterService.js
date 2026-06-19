import { supabase } from '../supabaseClient';

export async function getWaterLogs(userId, date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  const { data, error } = await supabase
    .from('water_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('logged_at', start.toISOString())
    .lte('logged_at', end.toISOString())
    .order('logged_at', { ascending: true });
  if (error) throw error;
  return data;
}

export async function logWaterIntake(userId, amountMl, date) {
  const { data, error } = await supabase
    .from('water_logs')
    .insert({
      user_id: userId,
      amount_ml: amountMl,
      logged_at: date ?? new Date().toISOString(),
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteWaterLog(logId) {
  const { error } = await supabase
    .from('water_logs')
    .delete()
    .eq('id', logId);
  if (error) throw error;
}

export async function getTodayTotalWater(userId, date) {
  const logs = await getWaterLogs(userId, date);
  return logs.reduce((sum, log) => sum + log.amount_ml, 0);
}

export async function getWaterGoal(userId) {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('water_goal_ml, weight_kg')
    .eq('user_id', userId)
    .single();
  if (error) throw error;
  return data;
}

export async function updateWaterGoal(userId, weightKg) {
  const goalMl = Math.round(weightKg * 33);
  const { data, error } = await supabase
    .from('user_profiles')
    .upsert({ user_id: userId, weight_kg: weightKg, water_goal_ml: goalMl })
    .select()
    .single();
  if (error) throw error;
  return data;
}
