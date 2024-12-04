interface TruncatedURLProps {
  url: string;
  maxLength?: number;
}

export default function TruncatedURL({ url, maxLength = 50 }: TruncatedURLProps) {
  const truncatedUrl = url.length > maxLength ? `${url.substring(0, maxLength)}...` : url;

  return (
    <span title={url} className="truncate max-w-[400px] block">
      {truncatedUrl}
    </span>
  );
}
