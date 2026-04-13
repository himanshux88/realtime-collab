import { supabase } from "services/supabaseClient";

/**
 * Invite a collaborator to a document by email.
 * Looks up the user in profiles, then inserts into collaborators.
 *
 * @param {string} documentId - The document to share
 * @param {string} email - The invitee's email address
 * @param {string} role - "viewer" or "editor"
 * @returns {Object} The new collaborator record with email
 */
export const addCollaborator = async (documentId, email, role = "viewer") => {
  const trimmedEmail = email.toLowerCase().trim();

  // 1. Find the user by email in the profiles table
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, email")
    .eq("email", trimmedEmail)
    .single();

  if (profileError || !profile) {
    throw new Error("No user found with that email address");
  }

  // 2. Prevent inviting the document owner
  const { data: doc, error: docError } = await supabase
    .from("documents")
    .select("user_id")
    .eq("id", documentId)
    .single();

  if (docError) throw new Error("Document not found");

  if (doc.user_id === profile.id) {
    throw new Error("Cannot invite the document owner as a collaborator");
  }

  // 3. Insert collaborator — UNIQUE(document_id, user_id) prevents duplicates
  const { data, error } = await supabase
    .from("collaborators")
    .insert([{ document_id: documentId, user_id: profile.id, role }])
    .select("id, user_id, role, created_at")
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error("This user is already a collaborator on this document");
    }
    throw error;
  }

  return { ...data, email: profile.email };
};

/**
 * Fetch all collaborators for a document, including their email.
 * Uses a two-query approach: fetch collaborators, then batch-lookup emails.
 *
 * @param {string} documentId
 * @returns {Array} List of collaborators with email field
 */
export const getCollaborators = async (documentId) => {
  const { data, error } = await supabase
    .from("collaborators")
    .select("id, user_id, role, created_at")
    .eq("document_id", documentId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  if (!data || data.length === 0) return [];

  // Batch-fetch emails from profiles
  const userIds = data.map((c) => c.user_id);
  const { data: profiles, error: profileError } = await supabase
    .from("profiles")
    .select("id, email")
    .in("id", userIds);

  if (profileError) throw profileError;

  const emailMap = {};
  (profiles || []).forEach((p) => {
    emailMap[p.id] = p.email;
  });

  return data.map((collab) => ({
    ...collab,
    email: emailMap[collab.user_id] || "Unknown",
  }));
};

/**
 * Remove a collaborator by their record ID.
 * RLS ensures only the document owner can delete.
 *
 * @param {string} collaboratorId
 */
export const removeCollaborator = async (collaboratorId) => {
  const { error } = await supabase
    .from("collaborators")
    .delete()
    .eq("id", collaboratorId);

  if (error) throw error;
};

/**
 * Update a collaborator's role.
 * RLS ensures only the document owner can update.
 *
 * @param {string} collaboratorId
 * @param {string} role - "viewer" or "editor"
 */
export const updateCollaboratorRole = async (collaboratorId, role) => {
  const { data, error } = await supabase
    .from("collaborators")
    .update({ role })
    .eq("id", collaboratorId)
    .select("id, user_id, role, created_at")
    .single();

  if (error) throw error;
  return data;
};

/**
 * Get the current user's role for a specific document.
 * Returns "owner" | "editor" | "viewer" | null.
 *
 * @param {string} documentId
 * @returns {string|null}
 */
export const getUserRole = async (documentId) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Check if the user is the document owner
  const { data: doc } = await supabase
    .from("documents")
    .select("user_id")
    .eq("id", documentId)
    .single();

  if (doc?.user_id === user.id) return "owner";

  // Check if the user is a collaborator
  const { data: collab } = await supabase
    .from("collaborators")
    .select("role")
    .eq("document_id", documentId)
    .eq("user_id", user.id)
    .single();

  return collab?.role || null;
};
