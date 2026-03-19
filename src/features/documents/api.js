import { supabase } from "services/supabaseClient";

export const createDocument = async (title) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase.from("documents").insert([
    {
      title,
      owner_id: user.id,
      content: "",
    },
  ]);

  if (error) throw error;
  return data;
};

export const getDocuments = async () => {
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const getDocumentsById = async (id) => {
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const updateDocument = async (id, content) => {
  const { data, error } = await supabase
    .from("documents")
    .update({
      content,
      updated_at: new Date(),
    })
    .eq("id", id);

  if (error) {
    throw error;
  }

  return data;
};
