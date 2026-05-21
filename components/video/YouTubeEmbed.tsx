export function YouTubeEmbed({ id, title }: { id: string; title: string }) {
  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg border border-line bg-black">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}`}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      />
    </div>
  );
}
