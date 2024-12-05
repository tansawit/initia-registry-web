import { Chain } from '../types/chain';
import Image from 'next/image';

interface ChainCardProps {
  chain: Chain;
  isSelected: boolean;
  onClick: () => void;
}

export default function ChainCard({ chain, isSelected, onClick }: ChainCardProps) {
  return (
    <div
      className={`p-2 rounded-lg cursor-pointer transition-all duration-200 border ${
        isSelected
          ? 'bg-white/5 border-white/50 shadow-sm shadow-white/10'
          : 'border-transparent hover:bg-white/5 hover:border-white/10'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center space-x-3">
        {chain.logo_URIs?.png && (
          <div className="w-8 h-8 relative flex-shrink-0">
            <Image
              src={chain.logo_URIs.png}
              alt={chain.pretty_name}
              width={32}
              height={32}
              className="rounded-full"
            />
          </div>
        )}
        <div>
          <h3 className="font-medium text-white text-sm">{chain.pretty_name}</h3>
          <p className="text-xs text-white/60">{chain.chain_id}</p>
        </div>
      </div>
    </div>
  );
}
