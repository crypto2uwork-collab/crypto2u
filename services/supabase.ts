
import { createClient } from '@supabase/supabase-js';

// Vui lòng điền URL và Anon Key của bạn vào đây
const supabaseUrl = 'https://ptynqcuadbdymjsxjrlb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0eW5xY3VhZGJkeW1qc3hqcmxiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjkxMTE3NSwiZXhwIjoyMDgyNDg3MTc1fQ.tbOerzAbp29rtzvGQoQ4zn-FgwgT5raE2Zoo6IfJwrE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
