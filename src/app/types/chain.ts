export interface Chain {
  chain_name: string;
  chain_id: string;
  pretty_name: string;
  status?: string;
  network_type: string;
  website?: string;
  description?: string;
  logo_URIs?: {
    png?: string;
    svg?: string;
  };
  apis: {
    rest: Array<{
      address: string;
      provider: string;
      authorizedUser?: string;
    }>;
    rpc: Array<{
      address: string;
      provider: string;
      authorizedUser?: string;
    }>;
    grpc?: Array<{
      address: string;
      provider: string;
      authorizedUser?: string;
    }>;
    'json-rpc'?: Array<{
      address: string;
      provider: string;
    }>;
  };
  fees?: {
    fee_tokens: Array<{
      denom: string;
      fixed_min_gas_price: number;
      low_gas_price: number;
      average_gas_price: number;
      high_gas_price: number;
    }>;
  };
  metadata?: {
    op_bridge_id?: string;
    op_denoms?: string[];
    executor_uri?: string;
    is_l1?: boolean;
    ibc_channels?: Array<{
      chain_id: string;
      port_id: string;
      channel_id: string;
      version: string;
    }>;
    assetlist?: string;
    minitia?: {
      type: string;
      version: string;
    };
  };
  bech32_prefix: string;
}
