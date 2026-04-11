import { supabase } from "services/supabaseClient";

export const addComment = async (data) => {
  const { error } = await supabase.from("comments").insert([data]);
  if (error) throw error;
};

export const getComments = async (document_id) => {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("document_id", document_id)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data;
};
