import { useEffect, useState } from 'react';
import CopyButton from './CopyButton';
import TruncatedURL from './TruncatedURL';

interface GRPCEndpointInfo {
  url: string;
  provider: string;
}

interface GRPCEndpointTableProps {
  endpoints: Array<{
    address: string;
    provider: string;
    authorizedUser?: string;
  }>;
}

export default function GRPCEndpointTable({ endpoints }: GRPCEndpointTableProps) {
  const [endpointStatus, setEndpointStatus] = useState<GRPCEndpointInfo[]>([]);

  useEffect(() => {
    // Filter out endpoints with authorizedUser field
    const publicEndpoints = endpoints.filter((endpoint) => !endpoint.authorizedUser);

    const endpointInfo = publicEndpoints.map((endpoint) => ({
      url: endpoint.address,
      provider: endpoint.provider,
    }));

    setEndpointStatus(endpointInfo);
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
          </tr>
        </thead>
        <tbody className="divide-y divide-dark-700">
          {endpointStatus.map((status, index) => (
            <tr key={index} className="hover:bg-dark-800">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                <div className="flex items-center group">
                  <TruncatedURL url={status.url} />
                  <CopyButton text={status.url} />
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {status.provider}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
