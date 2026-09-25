export interface TeamMember {
  name: string
  role: string
  platform: string
}

export const itTeam: TeamMember[] = [
  { name: "BJ Meyer", role: "CIO", platform: "cio" },
  { name: "Rodney Moore", role: "Director IT Support", platform: "director" },
  { name: "Landon Davis", role: "IT Support Manager", platform: "manager" },
  { name: "Jon Ong", role: "Team Lead, Tier 3", platform: "team-lead-tier3" },
  { name: "Jon Jewett", role: "Tier 3", platform: "team-lead-tier3" },
  { name: "Rex Kleckner", role: "Tier 2", platform: "tier-2" },
  { name: "Christian Gresham", role: "Tier 2", platform: "tier-2" },
  { name: "Chris Vu", role: "Tier 2", platform: "tier-2" },
  { name: "Trent Shaw", role: "Tier 2", platform: "tier-2" },
  { name: "Jorge Castañeda", role: "Tier 2", platform: "tier-2" },
  { name: "Jose Moran", role: "Tier 2", platform: "tier-2" },
  { name: "Ian Johnson", role: "Tier 1", platform: "tier-1" },
  { name: "Ian Wickham", role: "Tier 1", platform: "tier-1" },
  { name: "Jonathan Rodriguez", role: "Tier 1", platform: "tier-1" },
  { name: "Tony Dinh", role: "Tier 1", platform: "tier-1" },
  { name: "Amber Wallace.", role: "Tier 1", platform: "tier-1" },
  { name: "Kyle Moreno", role: "Tier 1", platform: "tier-1" },
  { name: "Diego Velez", role: "Tier 1", platform: "tier-1" },
  { name: "Mohammad Wajiduddin", role: "Tier 1", platform: "tier-1" },
  { name: "Johan Cortes", role: "Tier 1", platform: "tier-1" },
  { name: "Daiver Bejar", role: "Tier 1", platform: "tier-1" },
  { name: "Carlos Tunarrosa", role: "Tier 1", platform: "tier-1" },
  { name: "Steffania Triana", role: "Tier 1", platform: "tier-1" },
  { name: "Pedro Ramos", role: "Tier 1", platform: "tier-1" },
]

export interface PlatformConfig {
  key: string
  label: string
}

export const platforms: PlatformConfig[] = [
  { key: 'cio', label: 'CIO' },
  { key: 'director', label: 'Director' },
  { key: 'manager', label: 'Manager' },
  { key: 'team-lead-tier3', label: 'Team Lead / Tier 3' },
  { key: 'tier-2', label: 'Tier 2' },
  { key: 'tier-1', label: 'Tier 1' },
]