
import React, { createContext, useContext } from 'react';
import { articles, glossary } from '../data/content';
import type { Article, Term } from '../types';

const translations = {
  vi: {
    // Navbar
    home: 'Trang Chủ',
    news: 'Tin Tức',
    guides: 'Hướng Dẫn',
    research: 'Nghiên Cứu',
    glossary: 'Từ Điển',
    community: 'Cộng Đồng',
    about: 'Giới Thiệu',
    searchPlaceholder: 'Tìm kiếm bài viết...',
    searchCmd: 'Tìm kiếm',
    noResults: 'Không có kết quả cho',
    
    // Auth & Profile
    login: 'Đăng nhập',
    register: 'Đăng ký',
    profile: 'Hồ sơ cá nhân',
    logout: 'Đăng xuất',
    welcomeBack: 'Chào mừng trở lại!',
    
    // News
    newsTitle: 'Tin tức & Xu hướng',
    searchNewsPlaceholder: 'Tìm tin tức (VD: Bitcoin, Ethereum...)',
    latestNews: 'Tin nóng 24h',
    liveNewsResult: 'Tin tức trực tiếp từ AI',
    updating: 'Đang cập nhật...',
    refresh: 'Làm mới',
    noNewsFound: 'Không tìm thấy tin tức nào.',

    // Home
    heroTag: 'Học Crypto Miễn Phí',
    heroTitle: 'Khám phá thế giới',
    heroSubtitle: 'Tiền Mã Hóa',
    heroDesc: 'Nền tảng giáo dục toàn diện dành cho người mới bắt đầu. Kiến thức chuẩn, dễ hiểu và an toàn.',
    ctaStart: 'Bắt đầu học',
    ctaResearch: 'Xem nghiên cứu',
    featureSafe: 'An toàn',
    featureSafeDesc: 'Học cách tự bảo vệ tài sản của bạn.',
    featurePractical: 'Thực tế',
    featurePracticalDesc: 'Hướng dẫn từng bước thao tác.',
    featureUpdate: 'Cập nhật',
    featureUpdateDesc: 'Tin tức thị trường mới nhất.',
    sectionFeatured: 'Bài viết nổi bật',
    sectionLatest: 'Mới cập nhật',
    views: 'lượt xem',
    viewAll: 'Xem tất cả',
    
    // Sidebar
    trendingCoins: 'Xu hướng tìm kiếm',
    followUs: 'Theo dõi chúng tôi',
    followBtn: 'Theo dõi ngay',
    newsletterTitle: 'Đăng ký bản tin',
    newsletterDesc: 'Nhận phân tích thị trường và cơ hội đầu tư vào mỗi sáng thứ Hai.',
    emailPlaceholder: 'Email của bạn...',
    subscribeBtn: 'Đăng ký miễn phí',
    loading: 'Đang tải...',

    // Article Detail
    back: 'Quay lại',
    published: 'Đăng ngày',
    shareTitle: 'Chia sẻ bài viết',
    shareDesc: 'Thấy hữu ích? Chia sẻ ngay.',
    copyLink: 'Sao chép Link',
    copied: 'Đã sao chép!',
    relatedArticles: 'Bài viết liên quan',
    articleNotFound: 'Không tìm thấy bài viết',
    backHome: 'Về trang chủ',

    // Guides
    guidesTitle: 'Trung tâm Hướng Dẫn',
    guidesSubtitle: 'Lộ trình học tập từ cơ bản đến nâng cao.',
    levelBeginner: 'Người mới',
    levelBeginnerDesc: 'Bắt đầu từ con số 0: Tạo ví, bảo mật.',
    levelIntermediate: 'Trung cấp',
    levelIntermediateDesc: 'DeFi, Staking và tối ưu lợi nhuận.',
    levelAdvanced: 'Nâng cao',
    levelAdvancedDesc: 'Phân tích on-chain, săn Gem.',
    learnNow: 'Học ngay',
    allGuides: 'Tất cả bài viết',
    readNow: 'Đọc ngay',

    // Research
    researchTitle: 'Nghiên cứu & Phân tích',
    researchSubtitle: 'Dữ liệu thị trường và xu hướng chuyên sâu.',
    trendTitle: 'Xu hướng 2026',
    trendDesc: 'Thị trường đang chuyển dịch sang Modular Blockchain và AI tích hợp.',
    readReport: 'Đọc báo cáo',
    researchArticles: 'Bài viết nghiên cứu',
    viewAnalysis: 'Xem phân tích',

    // AI Summarizer Tool
    summarizerTitle: 'Trợ lý đọc nhanh AI',
    summarizerDesc: 'Tóm tắt báo cáo tiếng Anh và tự động dịch sang tiếng Việt bằng công nghệ AI tiên tiến.',
    summarizerPlaceholder: 'Dán đoạn văn bản tiếng Anh (Tin tức, Whitepaper, Phân tích) vào đây...',
    summarizeBtn: 'Tóm tắt & Dịch',
    summarizing: 'AI đang đọc...',
    summaryResult: 'Nội dung tóm tắt (Tiếng Việt):',
    copySummary: 'Sao chép',

    // Glossary
    glossaryTitle: 'Từ điển Crypto',
    glossarySubtitle: 'Tra cứu hơn 100+ thuật ngữ chuyên ngành.',
    searchTerm: 'Tìm thuật ngữ (VD: NFT...)',
    
    // Community
    communityTitle: 'Cộng đồng Crypto2u',
    communitySubtitle: 'Nơi chia sẻ kiến thức và cùng nhau phát triển.',
    twitterTitle: 'Twitter Chính Thức',
    twitterDesc: 'Cập nhật nhanh, thảo luận ngắn gọn.',
    discordTitle: 'Discord & Telegram',
    discordDesc: 'Chat thời gian thực (Sắp ra mắt).',
    comingSoon: 'Sắp ra mắt',
    contributeTitle: 'Đóng góp ý tưởng',
    contributeDesc: 'Gửi bài viết hoặc thuật ngữ mới cho chúng tôi.',
    yourName: 'Tên của bạn',
    yourEmail: 'Email liên hệ',
    yourContent: 'Nội dung đóng góp...',
    sendBtn: 'Gửi đóng góp',
    eventsTitle: 'Sự kiện sắp tới',

    // About
    aboutTitle: 'Về Crypto2u',
    aboutDesc: 'Dự án phi lợi nhuận vì cộng đồng Việt Nam.',
    missionTitle: 'Sứ mệnh',
    missionDesc: 'Chúng tôi tin rằng kiến thức là chìa khóa để đầu tư an toàn. Crypto2u cung cấp thông tin trung lập, không shill coin rác.',
    visionTitle: 'Giá trị cốt lõi',
    valAccessible: 'Dễ tiếp cận',
    valAccessibleDesc: 'Nội dung tiếng Việt dễ hiểu.',
    valAccurate: 'Chính xác',
    valAccurateDesc: 'Dựa trên dữ liệu thực tế.',
    valCommunity: 'Cộng đồng',
    valCommunityDesc: 'Cùng nhau đóng góp và chia sẻ.',
    joinUs: 'Tham gia cùng chúng tôi!',
    
    // Footer
    footerDesc: 'Nền tảng giáo dục tiền điện tử uy tín.',
    explore: 'Khám phá',
    support: 'Hỗ trợ',
    helpCenter: 'Trợ giúp',
    terms: 'Điều khoản',
    privacy: 'Bảo mật',
    riskTitle: 'Cảnh báo rủi ro',
    riskDesc: 'Đầu tư Crypto có rủi ro cao. Hãy tự nghiên cứu (DYOR).',
    rights: 'Bản quyền thuộc về Crypto2u.',

    // Help Center
    helpTitle: 'Trung tâm trợ giúp',
    helpSubtitle: 'Chúng tôi có thể giúp gì cho bạn?',
    chatAI: 'Chat với Crypto2u AI',
    chatAIDesc: 'Hỗ trợ giải đáp kiến thức 24/7.',
    contactSupport: 'Liên hệ Support',
    contactDesc: 'Gửi email cho đội ngũ hỗ trợ.',
    faqTitle: 'Câu hỏi thường gặp',
    faq1_q: 'Crypto2u có thu phí không?',
    faq1_a: 'Không. Sứ mệnh của chúng tôi là phổ cập kiến thức blockchain miễn phí cho người Việt.',
    faq2_q: 'Tôi có thể đóng góp bài viết không?',
    faq2_a: 'Có! Hãy truy cập trang "Cộng đồng" để gửi bài viết hoặc thuật ngữ mới.',
    faq3_q: 'Thông tin trên web có chính xác không?',
    faq3_a: 'Chúng tôi nỗ lực cập nhật thông tin chính xác nhất, nhưng thị trường Crypto biến động rất nhanh. Hãy luôn tự nghiên cứu (DYOR).',
    faq4_q: 'Làm sao để xóa dữ liệu xem bài viết?',
    faq4_a: 'Dữ liệu được lưu trên trình duyệt của bạn (LocalStorage). Bạn chỉ cần xóa cache trình duyệt là xong.',

    // Terms
    termsTitle: 'Điều khoản sử dụng',
    termsWarning: 'Cảnh báo rủi ro: Đầu tư tiền mã hóa mang lại lợi nhuận cao nhưng cũng đi kèm rủi ro mất toàn bộ vốn. Crypto2u không chịu trách nhiệm cho bất kỳ quyết định đầu tư nào của bạn.',
    term1_title: '1. Chấp nhận điều khoản',
    term1_desc: 'Bằng việc truy cập và sử dụng website Crypto2u, bạn đồng ý tuân thủ các điều khoản và điều kiện được quy định tại đây.',
    term2_title: '2. Mục đích sử dụng',
    term2_desc: 'Tất cả nội dung trên website (bài viết, dữ liệu, biểu đồ) chỉ phục vụ mục đích giáo dục và tham khảo. Chúng không được xem là lời khuyên tài chính (Financial Advice).',
    term3_title: '3. Bản quyền nội dung',
    term3_desc: 'Nội dung trên Crypto2u thuộc sở hữu trí tuệ của chúng tôi hoặc các đối tác. Bạn được phép chia sẻ nhưng phải ghi rõ nguồn và không sử dụng cho mục đích thương mại khi chưa có sự đồng ý.',
    term4_title: '4. Liên kết bên thứ ba',
    term4_desc: 'Website có thể chứa các liên kết đến trang web khác. Chúng tôi không kiểm soát và không chịu trách nhiệm về nội dung hoặc tính bảo mật của các trang web đó.',

    // Privacy
    privacyTitle: 'Chính sách bảo mật',
    privacyFeature1: 'Không cần đăng ký',
    privacyFeature2: 'Ẩn danh 100%',
    privacyFeature3: 'Không lưu trữ dữ liệu',
    priv1_title: '1. Dữ liệu chúng tôi thu thập',
    priv1_desc: 'Crypto2u tôn trọng quyền riêng tư của bạn. Chúng tôi không yêu cầu bạn tạo tài khoản, cung cấp email hay số điện thoại để truy cập nội dung.',
    priv2_title: '2. Cookie & Local Storage',
    priv2_desc: 'Chúng tôi sử dụng LocalStorage trên trình duyệt của bạn để lưu trữ các thiết lập cá nhân (ví dụ: đếm số lần bạn xem bài viết, cài đặt giao diện). Dữ liệu này nằm hoàn toàn trên thiết bị của bạn.',
    priv3_title: '3. Dịch vụ bên thứ ba',
    priv3_desc: 'Chúng tôi sử dụng các dịch vụ AI bên thứ ba cho tính năng Chatbot và Tóm tắt. Nội dung câu hỏi của bạn sẽ được xử lý tự động. Vui lòng không nhập thông tin nhạy cảm vào khung chat.',

    // Studio
    studioTitle: 'AI Creative Studio',
    studioDesc: 'Biến ý tưởng thành hình ảnh nghệ thuật với sức mạnh của công nghệ AI tạo sinh.',
    studioPromptLabel: 'Mô tả hình ảnh',
    studioPromptPlaceholder: 'Ví dụ: Một phi hành gia đang chơi guitar trên mặt trăng, phong cách cyberpunk...',
    studioGenerateBtn: 'Tạo hình ảnh',
    studioGenerating: 'Đang khởi tạo...',
    download: 'Tải xuống',
    studioEmpty: 'Chưa có hình ảnh nào được tạo.',
  }
};

interface SettingsContextType {
  t: (key: keyof typeof translations['vi']) => string;
  getContent: () => { articles: Article[]; glossary: Term[] };
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const t = (key: keyof typeof translations['vi']) => {
    return translations['vi'][key] || key;
  };

  const getContent = () => {
    return {
      articles,
      glossary
    };
  };

  return (
    <SettingsContext.Provider value={{ t, getContent }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
