import { GhatPhotoCard } from '../../components/ghats/GhatCardsGrid';
import type { components } from '../../api/schema';

type RankedGhat = components['schemas']['RankedGhat'];

interface GhatRankingGridProps {
  ghats: RankedGhat[];
  cpcbClass: string;
}

export function GhatRankingGrid({ ghats, cpcbClass }: GhatRankingGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" data-testid="ranking-grid">
      {ghats.map((ghat) => (
        <GhatPhotoCard key={ghat.slug} ghat={ghat} cpcbClass={cpcbClass} />
      ))}
    </div>
  );
}
