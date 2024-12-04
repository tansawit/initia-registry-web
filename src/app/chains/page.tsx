'use client';

import { useEffect, useState } from 'react';
import { Chain } from '../types/chain';
import { Asset } from '../types/asset';
import Image from 'next/image';
import EndpointTable from '../components/EndpointTable';
import RPCEndpointTable from '../components/RPCEndpointTable';
import GRPCEndpointTable from '../components/GRPCEndpointTable';
import JSONRPCEndpointTable from '../components/JSONRPCEndpointTable';
import ChainCard from '../components/ChainCard';
import AssetCard from '../components/AssetCard';

function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function ChainsPage() {
  const [chains, setChains] = useState<Chain[]>([]);
  const [filteredChains, setFilteredChains] = useState<Chain[]>([]);
  const [selectedChain, setSelectedChain] = useState<Chain | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNetworkType, setSelectedNetworkType] = useState<string>('all');
  const [networkTypes, setNetworkTypes] = useState<string[]>([]);
  const [assetList, setAssetList] = useState<Asset[]>([]);

  // Collapse states
  const [expandedSections, setExpandedSections] = useState({
    details: true,
    description: true,
    assets: false,
    endpoints: true,
    ibc: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Reset expanded sections when chain changes
  useEffect(() => {
    setExpandedSections({
      details: true,
      description: true,
      assets: false,
      endpoints: true,
      ibc: false,
    });
  }, [selectedChain]);

  // Fetch chains data
  useEffect(() => {
    const fetchChains = async () => {
      try {
        const response = await fetch('https://registry.testnet.initia.xyz/chains.json');
        if (!response.ok) throw new Error('Failed to fetch chains');

        const data: Chain[] = await response.json();
        setChains(data);

        const types = Array.from(new Set(data.map((chain) => chain.network_type)));
        setNetworkTypes(types);

        if (data.length > 0) setSelectedChain(data[0]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchChains();
  }, []);

  // Fetch asset list when selected chain changes
  useEffect(() => {
    const fetchAssetList = async () => {
      if (!selectedChain?.metadata?.assetlist) {
        setAssetList([]);
        return;
      }

      try {
        const response = await fetch(selectedChain.metadata.assetlist);
        if (!response.ok) throw new Error('Failed to fetch asset list');

        const data = await response.json();
        setAssetList(data.assets);
      } catch (err) {
        console.error('Error fetching asset list:', err);
        setAssetList([]);
      }
    };

    fetchAssetList();
  }, [selectedChain]);

  // Filter chains based on search query and network type
  useEffect(() => {
    let filtered = chains;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (chain) =>
          chain.chain_name.toLowerCase().includes(query) ||
          chain.chain_id.toLowerCase().includes(query) ||
          chain.pretty_name.toLowerCase().includes(query)
      );
    }

    if (selectedNetworkType !== 'all') {
      filtered = filtered.filter((chain) => chain.network_type === selectedNetworkType);
    }

    // Sort with Initia chains at top, then alphabetically by pretty name
    filtered = [...filtered].sort((a, b) => {
      // Check if either chain is an Initia chain
      const isInitiaA = a.chain_id.toLowerCase().includes('initia');
      const isInitiaB = b.chain_id.toLowerCase().includes('initia');

      // If both are Initia chains or neither are, sort by pretty name
      if (isInitiaA === isInitiaB) {
        const nameA = a.pretty_name || a.chain_id;
        const nameB = b.pretty_name || b.chain_id;
        return nameA.localeCompare(nameB);
      }

      // If only one is an Initia chain, put it first
      return isInitiaA ? -1 : 1;
    });

    setFilteredChains(filtered);
  }, [chains, searchQuery, selectedNetworkType]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark-950">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-dark-950">
      {/* Left sidebar */}
      <div className="w-1/3 bg-dark-900/50 backdrop-blur-xl border-r border-dark-800/50 overflow-y-auto">
        <div className="p-4 sticky top-0 bg-dark-900/50 backdrop-blur-xl border-b border-dark-800/50 z-10">
          <h2 className="text-xl font-semibold mb-3 text-gray-100">Chains</h2>

          {/* Search and Filter */}
          <div className="space-y-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search chains..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-3 pr-9 py-2 bg-dark-800/50 border border-dark-700/50 rounded-lg text-gray-300 
                focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all
                placeholder:text-gray-500 text-sm"
              />
              <svg
                className="absolute right-2.5 top-2.5 h-4 w-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <select
              value={selectedNetworkType}
              onChange={(e) => setSelectedNetworkType(e.target.value)}
              className="w-full px-3 py-2 bg-dark-800/50 border border-dark-700/50 rounded-lg text-gray-300 
              focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all
              appearance-none cursor-pointer text-sm"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 0.75rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.25em 1.25em',
              }}
            >
              <option value="all">All Network Types</option>
              {networkTypes.map((type) => (
                <option key={type} value={type}>
                  {capitalizeFirstLetter(type)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="p-2 space-y-1">
          {filteredChains.map((chain) => (
            <ChainCard
              key={chain.chain_id}
              chain={chain}
              isSelected={selectedChain?.chain_id === chain.chain_id}
              onClick={() => setSelectedChain(chain)}
            />
          ))}
        </div>
      </div>

      {/* Right content */}
      <div className="flex-1 p-4">
        {selectedChain && (
          <div className="bg-dark-900/50 backdrop-blur-xl rounded-xl shadow-xl border border-dark-800/50">
            {/* Header */}
            <div className="p-4 border-b border-dark-800/50">
              <div className="flex items-center space-x-4">
                {selectedChain.logo_URIs?.png && (
                  <div className="w-12 h-12 relative flex-shrink-0">
                    <Image
                      src={selectedChain.logo_URIs.png}
                      alt={selectedChain.pretty_name}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                  </div>
                )}
                <div>
                  <h1 className="text-2xl font-bold text-gray-100">{selectedChain.pretty_name}</h1>
                  <p className="text-gray-400">Chain ID: {selectedChain.chain_id}</p>
                </div>
              </div>
            </div>

            <div className="p-4 space-y-4">
              {/* Details Section */}
              <div>
                <button
                  onClick={() => toggleSection('details')}
                  className="w-full flex items-center justify-between text-left mb-2"
                >
                  <h2 className="text-lg font-semibold text-gray-100">Details</h2>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                      expandedSections.details ? 'transform rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-200 ${
                    expandedSections.details ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-dark-800/30 rounded-lg p-3">
                      <p className="text-xs text-gray-400 mb-1">Network Type</p>
                      <p className="font-medium text-gray-200 text-sm">
                        {capitalizeFirstLetter(selectedChain.network_type)}
                      </p>
                    </div>
                    {selectedChain.website && (
                      <div className="bg-dark-800/30 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">Website</p>
                        <a
                          href={selectedChain.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
                        >
                          {selectedChain.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Description Section */}
              {selectedChain.description && (
                <div>
                  <button
                    onClick={() => toggleSection('description')}
                    className="w-full flex items-center justify-between text-left mb-2"
                  >
                    <h2 className="text-lg font-semibold text-gray-100">Description</h2>
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                        expandedSections.description ? 'transform rotate-180' : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-200 ${
                      expandedSections.description
                        ? 'max-h-[500px] opacity-100'
                        : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="bg-dark-800/30 rounded-lg p-3">
                      <p className="text-gray-300 text-sm">{selectedChain.description}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Assets Section */}
              {assetList.length > 0 && (
                <div>
                  <button
                    onClick={() => toggleSection('assets')}
                    className="w-full flex items-center justify-between text-left mb-2"
                  >
                    <h2 className="text-lg font-semibold text-gray-100">Assets</h2>
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                        expandedSections.assets ? 'transform rotate-180' : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  <div
                    className={`space-y-2 overflow-hidden transition-all duration-200 ${
                      expandedSections.assets ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    {assetList.map((asset, index) => (
                      <AssetCard key={index} asset={asset} />
                    ))}
                  </div>
                </div>
              )}

              {/* API Endpoints Section */}
              <div>
                <button
                  onClick={() => toggleSection('endpoints')}
                  className="w-full flex items-center justify-between text-left mb-2"
                >
                  <h2 className="text-lg font-semibold text-gray-100">API Endpoints</h2>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                      expandedSections.endpoints ? 'transform rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div
                  className={`space-y-3 overflow-hidden transition-all duration-200 ${
                    expandedSections.endpoints ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="bg-dark-800/30 rounded-lg p-3">
                    <h3 className="font-medium mb-2 text-gray-200 text-sm">REST APIs</h3>
                    <EndpointTable endpoints={selectedChain.apis.rest} />
                  </div>
                  <div className="bg-dark-800/30 rounded-lg p-3">
                    <h3 className="font-medium mb-2 text-gray-200 text-sm">RPC Endpoints</h3>
                    <RPCEndpointTable endpoints={selectedChain.apis.rpc} />
                  </div>
                  {selectedChain.apis.grpc && (
                    <div className="bg-dark-800/30 rounded-lg p-3">
                      <h3 className="font-medium mb-2 text-gray-200 text-sm">gRPC Endpoints</h3>
                      <GRPCEndpointTable endpoints={selectedChain.apis.grpc} />
                    </div>
                  )}
                  {selectedChain.apis['json-rpc'] && (
                    <div className="bg-dark-800/30 rounded-lg p-3">
                      <h3 className="font-medium mb-2 text-gray-200 text-sm">JSON-RPC Endpoints</h3>
                      <JSONRPCEndpointTable endpoints={selectedChain.apis['json-rpc']} />
                    </div>
                  )}
                </div>
              </div>

              {/* IBC Connections Section */}
              {selectedChain.metadata?.ibc_channels &&
                selectedChain.metadata.ibc_channels.length > 0 && (
                  <div>
                    <button
                      onClick={() => toggleSection('ibc')}
                      className="w-full flex items-center justify-between text-left mb-2"
                    >
                      <h2 className="text-lg font-semibold text-gray-100">IBC Connections</h2>
                      <svg
                        className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                          expandedSections.ibc ? 'transform rotate-180' : ''
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    <div
                      className={`space-y-3 overflow-hidden transition-all duration-200 ${
                        expandedSections.ibc ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      {/* Group and sort channels by chain_id */}
                      {Object.entries(
                        selectedChain.metadata.ibc_channels.reduce((acc, channel) => {
                          if (!acc[channel.chain_id]) {
                            acc[channel.chain_id] = [];
                          }
                          acc[channel.chain_id].push(channel);
                          return acc;
                        }, {} as { [key: string]: typeof selectedChain.metadata.ibc_channels })
                      )
                        .sort(([chainIdA], [chainIdB]) => {
                          const chainA = chains.find((chain) => chain.chain_id === chainIdA);
                          const chainB = chains.find((chain) => chain.chain_id === chainIdB);
                          const nameA = chainA?.pretty_name || chainIdA;
                          const nameB = chainB?.pretty_name || chainIdB;
                          return nameA.localeCompare(nameB);
                        })
                        .map(([chainId, channels]) => {
                          const connectedChain = chains.find((chain) => chain.chain_id === chainId);
                          const sortedChannels = [...channels].sort((a, b) => {
                            const numA = parseInt(a.channel_id.replace('channel-', '')) || 0;
                            const numB = parseInt(b.channel_id.replace('channel-', '')) || 0;
                            return numA - numB;
                          });

                          return (
                            <div
                              key={chainId}
                              className="bg-dark-800/30 rounded-lg overflow-hidden"
                            >
                              <div className="p-3 border-b border-dark-700/50 bg-dark-800/30">
                                <div className="flex items-center gap-3">
                                  {connectedChain?.logo_URIs?.png && (
                                    <div className="w-8 h-8 relative flex-shrink-0">
                                      <Image
                                        src={connectedChain.logo_URIs.png}
                                        alt={connectedChain.pretty_name || chainId}
                                        width={32}
                                        height={32}
                                        className="rounded-full"
                                      />
                                    </div>
                                  )}
                                  <div>
                                    <h3 className="font-medium text-gray-100">
                                      {connectedChain?.pretty_name || chainId}
                                    </h3>
                                    <p className="text-xs text-gray-400">{chainId}</p>
                                  </div>
                                </div>
                              </div>
                              <div className="divide-y divide-dark-700/30">
                                {sortedChannels.map((channel, index) => (
                                  <div key={index} className="p-3">
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                      <div>
                                        <p className="text-gray-400 text-xs mb-1">Channel ID</p>
                                        <p className="text-gray-200">{channel.channel_id}</p>
                                      </div>
                                      <div>
                                        <p className="text-gray-400 text-xs mb-1">Port ID</p>
                                        <p className="text-gray-200">{channel.port_id}</p>
                                      </div>
                                      <div className="col-span-2">
                                        <p className="text-gray-400 text-xs mb-1">Version</p>
                                        <p className="text-gray-200 font-mono text-xs">
                                          {channel.version}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
