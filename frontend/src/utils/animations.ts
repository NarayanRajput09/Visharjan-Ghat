import gsap from 'gsap';

export interface GlowOptions {
  color?: string;
  scale?: number;
  duration?: number;
}

const DEFAULT_GLOW = 'rgba(16, 185, 129, 0.7)';

const TIER_GLOW_COLORS: Record<string, string> = {
  high: 'rgba(239, 68, 68, 0.75)',
  medium: 'rgba(245, 158, 11, 0.75)',
  low: 'rgba(16, 185, 129, 0.75)',
  emerald: 'rgba(16, 185, 129, 0.75)',
  cyan: 'rgba(6, 182, 212, 0.75)',
  blue: 'rgba(30, 64, 175, 0.75)',
  default: DEFAULT_GLOW,
};

/**
 * Triggers a vibrant, punchy GSAP glow & spring ripple animation on any clicked or tapped element.
 */
export function triggerCardGlow(
  element: HTMLElement | null,
  options?: GlowOptions
) {
  if (!element) return;

  const colorKey = options?.color?.toLowerCase() || 'default';
  const glowColor: string = TIER_GLOW_COLORS[colorKey] ?? options?.color ?? DEFAULT_GLOW;
  const targetScale = options?.scale ?? 1.025;
  const duration = options?.duration ?? 0.45;

  gsap.killTweensOf(element);

  const tl = gsap.timeline();

  tl.to(element, {
    scale: 0.985,
    duration: 0.08,
    ease: 'power2.in',
  })
    .to(element, {
      scale: targetScale,
      boxShadow: `0 0 35px 8px ${glowColor}, 0 12px 30px -5px rgba(15, 23, 42, 0.25)`,
      duration: duration * 0.45,
      ease: 'back.out(2.2)',
    })
    .to(element, {
      scale: 1,
      boxShadow: `0 0 16px 2px ${glowColor.replace('0.75', '0.35').replace('0.7', '0.3')}, 0 4px 12px -2px rgba(15, 23, 42, 0.08)`,
      duration: duration * 0.55,
      ease: 'power2.out',
      clearProps: 'scale',
    });
}

/**
 * Attaches a global click/tap listener to automatically trigger GSAP glow on all elements
 * marked with `data-glow` or `data-glow-card`.
 */
export function initGlobalCardGlow() {
  if (typeof window === 'undefined') return () => {};

  const handlePointerDown = (e: MouseEvent | TouchEvent) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;

    const card = target.closest('[data-glow-card], [data-glow]') as HTMLElement | null;
    if (!card) return;

    const tier = card.getAttribute('data-glow-tier') || card.getAttribute('data-glow') || 'default';
    triggerCardGlow(card, { color: tier });
  };

  window.addEventListener('click', handlePointerDown, { passive: true });

  return () => {
    window.removeEventListener('click', handlePointerDown);
  };
}
