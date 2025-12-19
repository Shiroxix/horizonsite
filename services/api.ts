import { StatsResponse, PlayerDetail } from '../types';

export const fetchClubStats = async (): Promise<StatsResponse> => {
  const response = await fetch('/api/stats');
  if (response.status === 403) {
    throw new Error('Access Denied: Server IP not authorized in Brawl Stars API.');
  }
  if (!response.ok) {
    throw new Error('Failed to fetch club stats');
  }
  return response.json();
};

export const fetchPlayerDetail = async (tag: string): Promise<PlayerDetail> => {
  // tag includes # usually, but URL encoded in backend
  const cleanTag = tag.replace('#', '');
  const response = await fetch(`/api/player/${cleanTag}`);
  if (!response.ok) {
    throw new Error('Failed to fetch player details');
  }
  return response.json();
};

export const savePlayerMeta = async (tag: string, meta: number): Promise<void> => {
  const response = await fetch('/api/save-meta', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tag, meta }),
  });
  if (!response.ok) {
    throw new Error('Failed to save meta');
  }
};

export const fetchServerIP = async (): Promise<string> => {
  try {
    const response = await fetch('/api/meu-ip');
    if (!response.ok) return 'Unknown';
    const data = await response.json();
    return data.ip;
  } catch {
    return 'Error';
  }
};

export const getIconUrl = (id: number) => `https://cdn.brawlify.com/profile-icons/regular/${id}.png`;
export const getBrawlerUrl = (id: number) => `https://cdn.brawlify.com/brawlers/${id}.png`;