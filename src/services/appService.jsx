import { supabase } from "./supabase";

/**
 * Extract relative file path from a Supabase public URL
 * Example: https://xyz.supabase.co/storage/v1/object/public/app-icons/icon.png -> icon.png
 */
export function getStoragePathFromUrl(publicUrl) {
  if (!publicUrl) return null;
  const parts = publicUrl.split("/");
  return parts.slice(parts.indexOf("public") + 2).join("/");
}

/**
 * Delete a file from Supabase storage by its public URL
 */
export async function deleteStorageFile(bucket, publicUrl) {
  const path = getStoragePathFromUrl(publicUrl);
  if (!path) return;

  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) {
    console.error(`Error deleting file from ${bucket}:`, error);
  }
}

/**
 * Get all applications (newest first)
 */
export async function getApps() {
  const { data, error } = await supabase
    .from("apps")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching apps:", error);
    throw error;
  }

  return data || [];
}

/**
 * Get a single application by ID
 */
export async function getApp(id) {
  const { data, error } = await supabase
    .from("apps")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching single app:", error);
    throw error;
  }

  return data;
}

/**
 * Create a new application record
 */
export async function createApp(appData) {
  const { data, error } = await supabase
    .from("apps")
    .insert([appData])
    .select()
    .single();

  if (error) {
    console.error("Error creating app:", error);
    throw error;
  }

  return data;
}

export const createApplication = createApp;

/**
 * Update an existing application record by ID
 */
export async function updateApp(id, appData) {
  const { data, error } = await supabase
    .from("apps")
    .update(appData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating app:", error);
    throw error;
  }

  return data;
}

export const updateApplication = updateApp;

/**
 * Delete an application record by ID and clean up associated files
 */
export async function deleteApp(id) {
  // 1. Fetch current record to locate storage paths
  const app = await getApp(id);

  if (app) {
    // 2. Clean up associated files in storage
    if (app.icon_url) await deleteStorageFile("app-icons", app.icon_url);
    if (app.apk_url) await deleteStorageFile("apk-files", app.apk_url);
  }

  // 3. Delete database record
  const { error } = await supabase
    .from("apps")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting app:", error);
    throw error;
  }

  return true;
}

/**
 * Increment download count using Postgres RPC (atomic execution)
 * Falls back to client-side increment if RPC is not configured.
 */
export async function incrementDownload(id, currentCount = 0) {
  // Option A: Preferred Atomic Execution via Supabase RPC
  const { error: rpcError } = await supabase.rpc("increment_download", {
    row_id: id,
  });

  // Option B: Fallback if RPC function is not created in Database
  if (rpcError) {
    const { error } = await supabase
      .from("apps")
      .update({
        download_count: (currentCount || 0) + 1,
      })
      .eq("id", id);

    if (error) {
      console.error("Error incrementing downloads:", error);
      throw error;
    }
  }
}

/**
 * Realtime Postgres changes subscription
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