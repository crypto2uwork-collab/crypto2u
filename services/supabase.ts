
import { createClient } from '@supabase/supabase-js';

// Vui lòng thay thế bằng thông tin thật từ Supabase Dashboard (Settings > API)
// URL phải bắt đầu bằng https:// và kết thúc bằng .supabase.co
// LƯU Ý: Nếu bạn dùng biến môi trường, hãy đảm bảo chúng đã được nạp.
const supabaseUrl = (typeof process !== 'undefined' && process.env.SUPABASE_URL) || 'https://ptynqcuadbdymjsxjrlb.supabase.co';
const supabaseAnonKey = (typeof process !== 'undefined' && process.env.SUPABASE_ANON_KEY) || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0eW5xY3VhZGJkeW1qc3hqcmxiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjkxMTE3NSwiZXhwIjoyMDgyNDg3MTc1fQ.tbOerzAbp29rtzvGQoQ4zn-FgwgT5raE2Zoo6IfJwrE';

// Kiểm tra xem URL có hợp lệ không trước khi tạo client để tránh crash ứng dụng
const isValidUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' && url.includes('.supabase.co');
  } catch {
    return false;
  }
};

// Xuất biến kiểm tra để các component khác có thể hiển thị thông báo hướng dẫn
export const isSupabaseConfigured = isValidUrl(supabaseUrl) && supabaseAnonKey !== 'your-anon-key';

// Nếu URL không hợp lệ, chúng ta sử dụng một URL giả lập hợp lệ về cú pháp để tránh lỗi "Failed to construct 'URL'"
const finalUrl = isValidUrl(supabaseUrl) ? supabaseUrl : 'https://placeholder.supabase.co';

export const supabase = createClient(finalUrl, supabaseAnonKey);
