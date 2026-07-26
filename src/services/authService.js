import { supabase } from "./supabase";

export async function login(email, password) {

    const { error } =
        await supabase.auth.signInWithPassword({

            email,

            password

        });

    if (error)
        throw error;

}

export async function logout() {

    await supabase.auth.signOut();

}

export async function getUser() {

    const {

        data

    } = await supabase.auth.getUser();

    return data.user;

}