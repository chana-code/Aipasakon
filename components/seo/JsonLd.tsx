/**
 * Renders one or more JSON-LD objects as a <script type="application/ld+json">.
 * Server component — emits static markup, no client JS.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  const json = JSON.stringify(Array.isArray(data) ? data : [data]);
  return (
    <script
      type="application/ld+json"
      // JSON.stringify already escapes quotes; guard against </script> breakouts.
      dangerouslySetInnerHTML={{ __html: json.replace(/</g, '\\u003c') }}
    />
  );
}
