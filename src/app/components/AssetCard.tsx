import { Asset } from '../types/asset';
import Image from 'next/image';
import CopyButton from './CopyButton';

interface AssetCardProps {
  asset: Asset;
}

export default function AssetCard({ asset }: AssetCardProps) {
  // Check token type based on denom prefix and traces
  const hasTraces = asset.traces && asset.traces.length > 0;
  const sourceFromTraces = (hasTraces && asset.traces?.[0]?.counterparty?.chain_name) || '';
  const isIBCFromDenom = asset.base?.startsWith('ibc/');
  const isL2Bridge = asset.base?.startsWith('l2/');
  const isIBC = (hasTraces || isIBCFromDenom) && !isL2Bridge;

  // Get source chain or bridge info
  let sourceInfo = {
    type: '' as 'ibc' | 'bridge' | '',
    source: '',
    icon: null as JSX.Element | null,
  };

  // Helper to get source chain name with fallbacks
  const getSourceChain = () => {
    if (sourceFromTraces) return sourceFromTraces;
    if (asset.name?.toLowerCase().includes('from')) {
      const match = asset.name.match(/from\s+(\w+)/i);
      if (match) return match[1];
    }
    if (asset.name?.toLowerCase().includes('minimove')) {
      return 'Minimove';
    }
    return '';
  };

  if (isL2Bridge) {
    const source = getSourceChain();
    sourceInfo = {
      type: 'bridge',
      source: source ? `OP Bridge from ${source}` : 'OP Bridge',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 17l6-6M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    };
  } else if (isIBC) {
    const source = getSourceChain();
    if (source) {
      sourceInfo = {
        type: 'ibc',
        source,
        icon: (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        ),
      };
    }
  }

  return (
    <div className="bg-dark-800/30 rounded-lg p-3">
      <div className="flex items-center gap-3">
        {asset.logo_URIs?.png && (
          <Image
            src={asset.logo_URIs.png}
            alt={asset.symbol}
            width={24}
            height={24}
            className="rounded-full"
          />
        )}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-gray-200 text-sm">{asset.symbol}</h3>
            <span className="text-xs text-gray-400">({asset.name})</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            {asset.base && (
              <div className="flex items-center group">
                <span>Denom: </span>
                <span className="ml-1">{asset.base}</span>
                <CopyButton text={asset.base} />
              </div>
            )}
            {sourceInfo.type && (
              <div className="flex items-center gap-1">
                {sourceInfo.icon}
                <span>
                  {sourceInfo.type === 'ibc' ? `IBC from ${sourceInfo.source}` : sourceInfo.source}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
