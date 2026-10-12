"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {BookmarkX} from "lucide-react";
import {createClient} from "@/lib/supabase/client";
import styles from "./shortlist.module.css";
export default function RemoveShortlist({employerId,applicationId}:{employerId:string;applicationId:string}){
 const [busy,setBusy]=useState(false);const [error,setError]=useState("");const router=useRouter();
 async function remove(){setBusy(true);setError("");const {error}=await createClient().from("employer_shortlists").delete().eq("employer_id",employerId).eq("application_id",applicationId);if(error){setError(error.message);setBusy(false);return;}router.refresh();setBusy(false);}
 return <div className={styles.action}><button type="button" disabled={busy} onClick={()=>void remove()}><BookmarkX size={16}/>{busy?"Removing...":"Remove"}</button>{error&&<span role="alert">{error}</span>}</div>;
}
