export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  viewCount: string;
  url: string;
}

interface PlaylistItem {
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    resourceId: { videoId: string };
    thumbnails: {
      maxres?: { url: string };
      high?: { url: string };
      medium?: { url: string };
      default?: { url: string };
    };
  };
}

interface VideoStatItem {
  id: string;
  statistics: { viewCount?: string };
}

async function getUploadsPlaylistId(channelHandle: string): Promise<string> {
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forHandle=${encodeURIComponent(channelHandle)}&key=${process.env.YOUTUBE_API_KEY}`,
    { next: { revalidate: 3600 } }
  );
  const data = await res.json();
  if (!data.items?.length) throw new Error(`Channel not found: ${channelHandle}`);
  return data.items[0].contentDetails.relatedPlaylists.uploads as string;
}

export async function getRecentUploads(maxResults = 10): Promise<YouTubeVideo[]> {
  const handle = process.env.YOUTUBE_CHANNEL_HANDLE ?? "";
  const playlistId = await getUploadsPlaylistId(handle);

  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=${maxResults}&playlistId=${playlistId}&key=${process.env.YOUTUBE_API_KEY}`,
    { next: { revalidate: 3600 } }
  );
  const data = await res.json();
  if (!data.items?.length) return [];

  const items: PlaylistItem[] = data.items;
  const videoIds = items.map((i) => i.snippet.resourceId.videoId).join(",");

  // Fetch view counts
  const statsRes = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds}&key=${process.env.YOUTUBE_API_KEY}`,
    { next: { revalidate: 3600 } }
  );
  const statsData = await statsRes.json();
  const statsMap: Record<string, string> = {};
  (statsData.items as VideoStatItem[])?.forEach((v) => {
    statsMap[v.id] = v.statistics.viewCount ?? "0";
  });

  return items.map((item) => {
    const videoId = item.snippet.resourceId.videoId;
    const thumb =
      item.snippet.thumbnails.maxres?.url ??
      item.snippet.thumbnails.high?.url ??
      item.snippet.thumbnails.medium?.url ??
      item.snippet.thumbnails.default?.url ??
      "";
    return {
      id: videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: thumb,
      publishedAt: item.snippet.publishedAt,
      viewCount: statsMap[videoId] ?? "0",
      url: `https://www.youtube.com/watch?v=${videoId}`,
    };
  });
}

export async function searchChannelVideos(query: string): Promise<YouTubeVideo[]> {
  const channelHandle = process.env.YOUTUBE_CHANNEL_HANDLE ?? "";

  // First get channel ID from handle
  const chanRes = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${encodeURIComponent(channelHandle)}&key=${process.env.YOUTUBE_API_KEY}`
  );
  const chanData = await chanRes.json();
  if (!chanData.items?.length) return [];
  const channelId = chanData.items[0].id as string;

  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&q=${encodeURIComponent(query)}&maxResults=3&type=video&key=${process.env.YOUTUBE_API_KEY}`
  );
  const data = await res.json();
  if (!data.items?.length) return [];

  return data.items.map((item: { id: { videoId: string }; snippet: { title: string; description: string; publishedAt: string; thumbnails: { high?: { url: string }; medium?: { url: string }; default?: { url: string } } } }) => ({
    id: item.id.videoId,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnail:
      item.snippet.thumbnails.high?.url ??
      item.snippet.thumbnails.medium?.url ??
      item.snippet.thumbnails.default?.url ??
      "",
    publishedAt: item.snippet.publishedAt,
    viewCount: "0",
    url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
  }));
}
