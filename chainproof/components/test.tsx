import { createClient } from "@/utils/supabase/server";

export default async function Test() {
  const supabase = createClient();
  const { data: notes } = await supabase.from("proofs").select();

  return (
    <>
      <h2>Recent Notaries</h2>
      <pre>{JSON.stringify(notes, null, 2)}</pre>
    </>
  );
}
