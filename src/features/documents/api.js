import { supabase } from "services/supabaseClient";

export const createDocument = async (title) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase.from("documents").insert([
    {
      title,
      user_id: user.id,
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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (data.is_public) {
    return data;
  }

  if (!user) {
    throw new Error("Unauthorized");
  }

  if (String(user.id) !== String(data.user_id)) {
    throw new Error("Unauthorized");
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
