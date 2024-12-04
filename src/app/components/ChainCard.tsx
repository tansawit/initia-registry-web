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
          ? 'bg-dark-800/50 border-blue-500/50 shadow-sm shadow-blue-500/10'
          : 'border-transparent hover:bg-dark-800/30 hover:border-dark-700/50'
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
          <h3 className="font-medium text-gray-100 text-sm">{chain.pretty_name}</h3>
          <p className="text-xs text-gray-400">{chain.chain_id}</p>
        </div>
      </div>
    </div>
  );
}
