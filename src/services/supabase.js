import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://hlklwpkpxwktumrtxyph.supabase.co";
const supabaseKey = "sb_publishable_9vXTI16ZN-IcAgTRPZ4WgQ_2I03i-m1";

export const supabase = createClient(
    supabaseUrl,
    supabaseKey
);