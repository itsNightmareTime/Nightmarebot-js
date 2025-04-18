interface AchievementInfo {
  name: string;
  rank: number;
  progress?: number;
  progressMax?: number;
}

export interface PlayerStats {
  achievementScore?: number;
  gamesPlayed?: number;
  gamesWon?: { [key: string]: number };
  gamesLost?: { [key: string]: number };
  timePlayed?: { [key: string]: number };
  achievements?: AchievementInfo[];
}

export interface CallRCPDParams {
  path: string, 
  method: string, 
  queryParams?: string, 
  body?: BodyInit
}