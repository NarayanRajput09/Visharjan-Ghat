import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';

interface LanguageToggleProps {
  variant?: 'light' | 'dark';
}

export function LanguageToggle({ variant = 'dark' }: LanguageToggleProps) {
  const { i18n, t } = useTranslation();

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'hi' ? 'en' : 'hi';
    i18n.changeLanguage(nextLang);
    localStorage.setItem('visarjan_lang', nextLang);
  };

  const isDark = variant === 'dark';

  return (
    <button
      type="button"
      data-testid="language-toggle"
      onClick={toggleLanguage}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-[#36CFC9] ${
        isDark
          ? 'border border-slate-700 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200'
          : 'border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs'
      }`}
      aria-label={`${t('nav.language')}: ${i18n.language === 'hi' ? 'Switch to English' : 'हिंदी पर स्विच करें'}`}
    >
      <Languages className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-[#36CFC9]' : 'text-slate-500'}`} aria-hidden="true" />
      <span className={`font-semibold ${isDark ? 'text-[#36CFC9]' : 'text-blue-700'}`}>
        {i18n.language === 'hi' ? 'English' : 'हिन्दी'}
      </span>
    </button>
  );
}
