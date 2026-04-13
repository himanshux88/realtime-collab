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

/**
 * Fetch documents owned by the current user.
 * Explicitly filters by user_id to avoid returning unrelated public docs.
 */
export const getDocuments = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

/**
 * Fetch documents shared with the current user (via collaborators table).
 * Each returned document includes a `_sharedRole` property ("viewer" | "editor").
 */
export const getSharedDocuments = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  // Get all collaborator entries for this user
  const { data: collabs, error: collabError } = await supabase
    .from("collaborators")
    .select("document_id, role")
    .eq("user_id", user.id);

  if (collabError) {
    console.warn("Collaborators query failed:", collabError.message || collabError);
    return [];
  }
  if (!collabs || collabs.length === 0) return [];

  // Build a role lookup map
  const roleMap = {};
  collabs.forEach((c) => {
    roleMap[c.document_id] = c.role;
  });

  const docIds = collabs.map((c) => c.document_id);

  // Fetch the shared documents
  const { data: docs, error } = await supabase
    .from("documents")
    .select("*")
    .in("id", docIds)
    .order("created_at", { ascending: false });

  if (error) {
    console.warn("Shared documents query failed:", error.message || error);
    return [];
  }

  return (docs || []).map((doc) => ({
    ...doc,
    _sharedRole: roleMap[doc.id],
  }));
};

/**
 * Fetch a single document by ID with access control.
 *
 * Access rules (checked in order):
 * 1. Public documents → allow
 * 2. Document owner → allow
 * 3. Collaborator → allow
 * 4. Otherwise → throw "Unauthorized"
 */
export const getDocumentsById = async (id) => {
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  // Public documents are accessible to everyone
  if (data.is_public) {
    return data;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Owner has full access
  if (String(user.id) === String(data.user_id)) {
    return data;
  }

  // Check if user is a collaborator on this document
  const { data: collab } = await supabase
    .from("collaborators")
    .select("role")
    .eq("document_id", id)
    .eq("user_id", user.id)
    .single();

  if (collab) {
    return data;
  }

  throw new Error("Unauthorized");
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
