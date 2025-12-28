
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { supabase, isSupabaseConfigured } from '../services/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (newData: Partial<User>) => Promise<void>;
  isLoggedIn: boolean;
  isConfigured: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Hàm fetch profile với cơ chế retry nếu chưa tìm thấy bản ghi (đợi Trigger)
  const fetchProfile = async (id: string, email: string, metadata: any, retryCount = 0): Promise<void> => {
    if (!isSupabaseConfigured) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (data) {
        setUser(data);
        setLoading(false);
      } else if (retryCount < 3) {
        // Nếu chưa thấy profile, thử lại sau 2 giây (đợi SQL Trigger)
        console.log(`Profile chưa sẵn sàng, đang thử lại lần ${retryCount + 1}...`);
        setTimeout(() => fetchProfile(id, email, metadata, retryCount + 1), 2000);
      } else {
        // Nếu thử 3 lần vẫn không có, dùng dữ liệu từ Auth làm dự phòng để user vẫn vào được app
        setUser({
          id: id,
          name: metadata?.name || email.split('@')[0],
          email: email,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`,
          bio: 'Thành viên mới của Crypto2u',
          joinedDate: new Date().toLocaleDateString(),
          rank: 'Newbie'
        });
        setLoading(false);
      }
    } catch (err) {
      console.error("Lỗi fetch profile:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    // 1. Kiểm tra session ngay khi load trang
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        fetchProfile(session.user.id, session.user.email!, session.user.user_metadata);
      } else {
        setLoading(false);
      }
    });

    // 2. Lắng nghe thay đổi trạng thái (bao gồm cả khi vừa click email confirm)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth Event:", event);
      if (session) {
        fetchProfile(session.user.id, session.user.email!, session.user.user_metadata);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) throw error;
  };

  const signUp = async (email: string, pass: string, name: string) => {
    const { error } = await supabase.auth.signUp({ 
      email, 
      password: pass,
      options: {
        data: { name: name }
      }
    });
    if (error) throw error;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const updateUser = async (newData: Partial<User>) => {
    if (!user) return;
    const { error } = await supabase.from('profiles').update(newData).eq('id', user.id);
    if (error) throw error;
    setUser({ ...user, ...newData });
  };

  return (
    <AuthContext.Provider value={{ 
      user, loading, login, signUp, logout, updateUser, 
      isLoggedIn: !!user, isConfigured: isSupabaseConfigured 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
