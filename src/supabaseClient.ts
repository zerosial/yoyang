import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://xcgckoklfqlmrjtwfupb.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjZ2Nrb2tsZnFsbXJqdHdmdXBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0MDYwMTksImV4cCI6MjA2Mzk4MjAxOX0.QS9XlJv_MqMM0hii7s2eotg0kFKTt0RVVnPyXVq1q3Q"
);
