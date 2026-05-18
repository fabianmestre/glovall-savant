export interface PlayerReport {
  playerName: string;
  reportType: string;
}

export interface StatcastTelemetry {
  playerName: string;
  start_dt: string;
  end_dt: string;
}

export interface TelemetryData {
  launch_speed: number;
  launch_angle: number;
  events: string;
  description: string;
  pitch_type: string;
  release_speed: number;
  game_date: string;
}

export interface RankingItem {
  player: string;
  value: number | string;
  initials: string;
}

export interface RankingTable {
  title: string;
  endpoint: string;
  description: string;
  unit: string;
}
