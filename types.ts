export interface BrawlIcon {
  id: number;
}

export interface ClubMember {
  tag: string;
  name: string;
  nameColor: string;
  role: 'member' | 'senior' | 'vicePresident' | 'president';
  trophies: number;
  icon: BrawlIcon;
}

export interface ClubData {
  tag: string;
  name: string;
  description: string;
  type: string;
  badgeId: number;
  requiredTrophies: number;
  trophies: number;
  members: ClubMember[];
}

export interface PlayerDetail {
  tag: string;
  name: string;
  nameColor: string;
  icon: BrawlIcon;
  trophies: number;
  highestTrophies: number;
  expLevel: number;
  '3vs3Victories': number;
  soloVictories: number;
  duoVictories: number;
  club: {
    tag: string;
    name: string;
  };
  brawlers: {
    id: number;
    name: string;
    power: number;
    rank: number;
    trophies: number;
  }[];
}

export interface Metas {
  [tag: string]: number;
}

export interface StatsResponse {
  club: ClubData;
  metas: Metas;
}

export type Theme = 'neon' | 'dark' | 'clean' | 'gamer';