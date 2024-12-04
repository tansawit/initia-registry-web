import { useEffect, useState } from 'react';
import CopyButton from './CopyButton';
import TruncatedURL from './TruncatedURL';

interface JSONRPCEndpointInfo {
  url: string;
  provider: string;
}

interface JSONRPCEndpointTableProps {
  endpoints: Array<{
    address: string;
    provider: string;
  }>;
}

export default function JSONRPCEndpointTable({ endpoints }: JSONRPCEndpointTableProps) {
  const [endpointStatus, setEndpointStatus] = useState<JSONRPCEndpointInfo[]>([]);

  useEffect(() => {
    const endpointInfo = endpoints.map((endpoint) => ({
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
