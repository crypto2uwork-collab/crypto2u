
import React, { useState, useEffect } from 'react';
import { generateImage } from '../services/geminiService';
import { useSettings } from '../context/SettingsContext';
import { Sparkles, Download, Image as ImageIcon, Loader2, Key } from 'lucide-react';

// Define global interface for aistudio window object
declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

const Studio = () => {
    const { t } = useSettings();
    const [prompt, setPrompt] = useState('');
    const [size, setSize] = useState<'1K' | '2K' | '4K'>('1K');
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [hasKey, setHasKey] = useState<boolean>(false);

    // Fix: Check for selected API key on component mount as required by Imagen/Gemini 3 Pro guidelines
    useEffect(() => {
        const checkKey = async () => {
            if (window.aistudio) {
                const selected = await window.aistudio.hasSelectedApiKey();
                setHasKey(selected);
            }
        };
        checkKey();
    }, []);

    // Fix: Handle API key selection dialog
    const handleSelectKey = async () => {
        if (window.aistudio) {
            await window.aistudio.openSelectKey();
            // Guidelines: assume success after triggering the dialog to avoid race conditions
            setHasKey(true);
        }
    };

    const handleGenerate = async () => {
        if (!prompt) return;
        setLoading(true);
        setImage(null);
        const result = await generateImage(prompt, size);
        setImage(result);
        setLoading(false);
    }

    const handleDownload = () => {
        if (!image) return;
        const link = document.createElement('a');
        link.href = image;
        link.download = `crypto2u-ai-studio-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Fix: Show key selection UI if no key is selected
    if (!hasKey) {
        return (
            <div className="min-h-screen pt-24 pb-20 px-6 flex items-center justify-center">
                <div className="max-w-md w-full glass-panel p-8 text-center space-y-6">
                    <Key className="w-16 h-16 text-indigo-500 mx-auto" />
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Xác thực API Key</h2>
                    <p className="text-slate-600 dark:text-slate-400">
                        Để sử dụng tính năng tạo hình ảnh chất lượng cao (1K, 2K, 4K), bạn cần sử dụng API Key từ dự án Google Cloud có trả phí.
                    </p>
                    <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-xs text-indigo-700 dark:text-indigo-300">
                        Lưu ý: Bạn phải chọn một API Key từ project đã kích hoạt Billing.
                        <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="block mt-1 font-bold underline">
                            Xem tài liệu Billing
                        </a>
                    </div>
                    <button 
                        onClick={handleSelectKey}
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition"
                    >
                        Mở trình chọn API Key
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-20 px-6">
            <div className="container mx-auto max-w-4xl">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-6">
                        {t('studioTitle')}
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                        {t('studioDesc')}
                    </p>
                </div>

                <div className="card p-8 bg-white dark:bg-slate-800 shadow-xl border border-indigo-100 dark:border-slate-700">
                    <div className="flex flex-col gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                                {t('studioPromptLabel')}
                            </label>
                            <textarea 
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder={t('studioPromptPlaceholder')}
                                className="w-full h-32 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-slate-900 dark:text-white"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6 items-center justify-between">
                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Size:</label>
                                <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-lg">
                                    {(['1K', '2K', '4K'] as const).map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => setSize(s)}
                                            className={`px-4 py-1.5 rounded-md text-sm font-bold transition ${
                                                size === s 
                                                ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' 
                                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-200'
                                            }`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            <button 
                                onClick={handleGenerate}
                                disabled={loading || !prompt}
                                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                                {t('studioGenerateBtn')}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-12">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
                            <p className="text-slate-500 font-medium animate-pulse">{t('studioGenerating')}</p>
                        </div>
                    ) : image ? (
                        <div className="relative group">
                            <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                                <img src={image} alt="AI Generated" className="w-full h-auto" />
                            </div>
                            <button 
                                onClick={handleDownload}
                                className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur text-slate-900 rounded-xl shadow-lg hover:bg-white transition flex items-center gap-2 font-bold"
                            >
                                <Download size={20} />
                                {t('download')}
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                            <ImageIcon className="w-16 h-16 text-slate-300 dark:text-slate-600 mb-4" />
                            <p className="text-slate-400">{t('studioEmpty')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Studio;
