import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Copy, Check, Share2, Printer } from 'lucide-react';
import { Button } from '../../components/Button';
import type { components } from '../../api/schema';

type BriefResponse = components['schemas']['BriefResponse'];

type Props = {
  brief: BriefResponse;
};

export function ExportButtons({ brief }: Props) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  // Generate plain text formatted for copy / WhatsApp
  const buildPlainText = () => {
    return [
      `*${brief.en.headline}*`,
      '',
      '*Priority Risk Ghats:*',
      ...brief.en.top_risks.map((r, i) => `${i + 1}. ${r}`),
      '',
      '*Recommended Municipal Operations:*',
      ...brief.en.actions.map((a) => `• ${a}`),
      '',
      '*Data Gaps:*',
      ...brief.en.data_gaps.map((g) => `- ${g}`),
      '',
      `_${brief.en.source_line}_`,
      '',
      '--- HINDI BRIEF ---',
      `*${brief.hi.headline}*`,
      '',
      '*प्राथमिकता वाले जोखिम घाट:*',
      ...brief.hi.top_risks.map((r, i) => `${i + 1}. ${r}`),
      '',
      '*अनुशंसित परिचालन:*',
      ...brief.hi.actions.map((a) => `• ${a}`),
      '',
      '*डेटा अंतराल:*',
      ...brief.hi.data_gaps.map((g) => `- ${g}`),
      '',
      `_${brief.hi.source_line}_`,
    ].join('\n');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildPlainText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy brief:', err);
    }
  };

  const handleWhatsApp = () => {
    const text = buildPlainText();
    const encoded = encodeURIComponent(text.slice(0, 950)); // WhatsApp friendly length limit
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-wrap items-center gap-2.5 no-print" data-testid="export-buttons">
      {/* Copy */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopy}
        icon={copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
      >
        {copied ? t('brief.copied') : t('brief.copy')}
      </Button>

      {/* WhatsApp */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleWhatsApp}
        icon={<Share2 className="w-3.5 h-3.5 text-emerald-600" />}
      >
        {t('brief.whatsapp')}
      </Button>

      {/* Print */}
      <Button
        variant="secondary"
        size="sm"
        onClick={handlePrint}
        icon={<Printer className="w-3.5 h-3.5" />}
      >
        {t('brief.print')}
      </Button>
    </div>
  );
}
