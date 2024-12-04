export interface Asset {
  denom: string;
  type_asset: string;
  address?: string;
  base: string;
  name: string;
  display: string;
  symbol: string;
  traces?: Array<{
    type: string;
    counterparty: {
      chain_name: string;
      base_denom: string;
      channel_id: string;
    };
  }>;
  logo_URIs?: {
    png?: string;
    svg?: string;
  };
  coingecko_id?: string;
  decimals: number;
}

export interface AssetList {
  chain_name: string;
  assets: Asset[];
}
