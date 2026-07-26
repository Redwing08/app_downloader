import { supabase } from "./supabase";

/**
 * Upload a file to a Supabase Storage bucket
 * @param {string} bucket - Bucket name
 * @param {File} file - File to upload
 * @returns {string} Public URL
 */
export async function uploadFile(bucket, file) {

    if (!file) {
        throw new Error("No file selected.");
    }

    // Create unique filename
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;

    const { error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
            cacheControl: "3600",
            upsert: false,
        });

    if (error) {
        console.error("Upload Error:", error);
        throw error;
    }

    const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

    return data.publicUrl;
}

/**
 * Delete a file from a Supabase Storage bucket
 * @param {string} bucket - Bucket name
 * @param {string} publicUrl - Public URL of the uploaded file
 */
export async function deleteFile(bucket, publicUrl) {

    if (!publicUrl) return;

    try {

        // Extract filename from public URL
        const fileName = publicUrl.split("/").pop();

        const { error } = await supabase.storage
            .from(bucket)
            .remove([fileName]);

        if (error) {
            console.error("Delete Error:", error);
        }

    } catch (err) {

        console.error("Delete Exception:", err);

    }

}

/**
 * Replace an existing file
 * Deletes the old file then uploads the new one.
 *
 * @param {string} bucket
 * @param {string} oldUrl
 * @param {File} newFile
 * @returns {string} New public URL
 */
export async function replaceFile(bucket, oldUrl, newFile) {

    if (!newFile) {
        return oldUrl;
    }

    // Delete old file
    await deleteFile(bucket, oldUrl);

    // Upload new file
    const newUrl = await uploadFile(bucket, newFile);

    return newUrl;

}