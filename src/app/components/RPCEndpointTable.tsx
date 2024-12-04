import { useEffect, useState } from 'react';
import CopyButton from './CopyButton';
import TruncatedURL from './TruncatedURL';

interface RPCEndpointInfo {
  url: string;
  provider: string;
  blockHeight?: string;
  latency?: number;
  error?: string;
}

interface RPCEndpointTableProps {
  endpoints: Array<{
    address: string;
    provider: string;
    authorizedUser?: string;
  }>;
}

export default function RPCEndpointTable({ endpoints }: RPCEndpointTableProps) {
  const [endpointStatus, setEndpointStatus] = useState<RPCEndpointInfo[]>([]);

  useEffect(() => {
    const fetchEndpointStatus = async () => {
      // Filter out endpoints with authorizedUser field
      const publicEndpoints = endpoints.filter((endpoint) => !endpoint.authorizedUser);

      const statusPromises = publicEndpoints.map(async (endpoint) => {
        const info: RPCEndpointInfo = {
          url: endpoint.address,
          provider: endpoint.provider,
        };

        try {
          const startTime = performance.now();
          const response = await fetch(`${endpoint.address}/status`);

          if (!response.ok) {
            throw new Error('Failed to fetch');
          }

          const data = await response.json();
          const endTime = performance.now();

          info.blockHeight = data.result?.sync_info?.latest_block_height;
          info.latency = Math.round(endTime - startTime);
        } catch (error) {
          info.error = error instanceof Error ? error.message : 'Unknown error';
        }

        return info;
      });

      try {
        const results = await Promise.all(statusPromises);
        setEndpointStatus(results);
      } catch (error) {
        console.error('Error fetching endpoint status:', error);
      }
    };

    fetchEndpointStatus();
    // Refresh every 30 seconds
    const interval = setInterval(fetchEndpointStatus, 30000);

    return () => clearInterval(interval);
  }, [endpoints]);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-dark-700">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              URL
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Provider
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Latest Block
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Latency
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-dark-700">
          {endpointStatus.map((status, index) => (
            <tr key={index} className="hover:bg-dark-800">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                <div className="flex items-center group">
                  <a
                    href={status.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <TruncatedURL url={status.url} />
                  </a>
                  <CopyButton text={status.url} />
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {status.provider}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {status.blockHeight || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {status.latency ? `${(status.latency / 1000).toFixed(2)}s` : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    status.error ? 'bg-red-900 text-red-200' : 'bg-green-900 text-green-200'
                  }`}
                >
                  {status.error ? 'Error' : 'Online'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
