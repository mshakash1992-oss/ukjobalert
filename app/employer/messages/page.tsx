import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import EmployerShell from "../employer-shell";
import MessagesClient from "./messages-client";

type ConversationRow = {
  id: string; job_id: string; candidate_id: string; created_at: string;
};
type MessageRow = {
  id: string; conversation_id: string; sender_id: string; message: string; created_at: string;
};

export default async function EmployerMessagesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  if (user.user_metadata?.account_type !== "employer") redirect("/");

  const admin = createAdminClient();
  const { data: verification } = await admin.from("employer_verifications")
    .select("company_name").eq("user_id", user.id).maybeSingle();

  const { data: conversationsData, error: conversationsError } = await admin
    .from("job_conversations")
    .select("id,job_id,candidate_id,created_at")
    .eq("employer_id", user.id)
    .order("created_at", { ascending: false });

  const conversations = (conversationsData || []) as ConversationRow[];
  const ids = conversations.map(c => c.id);
  const jobIds = Array.from(new Set(conversations.map(c => c.job_id)));

  const [jobsResult, messagesResult] = await Promise.all([
    jobIds.length
      ? admin.from("jobs").select("id,title").eq("employer_id", user.id).in("id", jobIds)
      : Promise.resolve({ data: [], error: null }),
    ids.length
      ? admin.from("job_messages")
          .select("id,conversation_id,sender_id,message,created_at")
          .in("conversation_id", ids)
          .order("created_at", { ascending: true })
          .limit(2000)
      : Promise.resolve({ data: [], error: null }),
  ]);

  const titles = new Map((jobsResult.data || []).map(j => [String(j.id), String(j.title || "Job")]));
  const messages = (messagesResult.data || []) as MessageRow[];
  const name = verification?.company_name || user.user_metadata?.full_name || "Employer";

  return <EmployerShell companyName={name} active="messages">
    <MessagesClient
      userId={user.id}
      conversations={conversations.map(c => ({
        id: c.id,
        jobTitle: titles.get(c.job_id) || "Your job",
        candidateId: c.candidate_id,
        createdAt: c.created_at,
      }))}
      messages={messages.map(m => ({
        id: m.id, conversationId: m.conversation_id,
        senderId: m.sender_id, message: m.message, createdAt: m.created_at,
      }))}
      error={conversationsError?.message || jobsResult.error?.message || messagesResult.error?.message || ""}
      truncated={messages.length === 2000}
    />
  </EmployerShell>;
}
