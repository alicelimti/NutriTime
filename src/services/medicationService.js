import { supabase } from '../supabaseClient';

export async function getMedications(userId) {
  const { data, error } = await supabase
    .from('user_medications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data;
}

export async function addMedication(userId, medication) {
  const { data, error } = await supabase
    .from('user_medications')
    .insert({
      user_id: userId,
      medication_id: medication.id,
      name: medication.name,
      emoji: medication.emoji,
      time_group: medication.defaultGroup,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function removeMedication(userId, medicationId) {
  const { error } = await supabase
    .from('user_medications')
    .delete()
    .eq('user_id', userId)
    .eq('medication_id', medicationId);
  if (error) throw error;
}

export async function logMedicationIntake(userId, medicationId, date) {
  const { data, error } = await supabase
    .from('medication_logs')
    .insert({
      user_id: userId,
      medication_id: medicationId,
      taken_at: date ?? new Date().toISOString(),
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getMedicationLogs(userId, date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  const { data, error } = await supabase
    .from('medication_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('taken_at', start.toISOString())
    .lte('taken_at', end.toISOString());
  if (error) throw error;
  return data;
}

export async function deleteMedicationLog(logId) {
  const { error } = await supabase
    .from('medication_logs')
    .delete()
    .eq('id', logId);
  if (error) throw error;
}
