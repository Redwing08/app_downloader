import { supabase } from "./supabase";

/**
 * Get all applications
 */
export async function getApps() {
  const { data, error } = await supabase
    .from("apps")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    throw error;
  }

  return data || [];
}

/**
 * Create application
 */
export async function createApp(appData) {
  const { data, error } = await supabase
    .from("apps")
    .insert([appData])
    .select()
    .single();

  if (error) {
    console.error(error);
    throw error;
  }

  return data;
}

/**
 * Update application
 */
export async function updateApp(id, appData) {
  const { data, error } = await supabase
    .from("apps")
    .update(appData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw error;
  }

  return data;
}

/**
 * Delete application
 */
export async function deleteApp(id) {
  const { error } = await supabase
    .from("apps")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error);
    throw error;
  }

  return true;
}

/**
 * Realtime subscription
 */
export function subscribeApps(callback) {
  return supabase
    .channel("apps-channel")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "apps",
      },
      callback
    )
    .subscribe();
}

export async function createApplication(app) {

    const { data, error } = await supabase
        .from("apps")
        .insert(app)
        .select()
        .single();

    if(error)
        throw error;

    return data;

}