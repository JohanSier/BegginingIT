export interface TeamMember {
  name: string
  role: string
  platform: string
  location?: string
}

export const itTeam: TeamMember[] = [
  { name: "BJ Meyer", role: "CIO", platform: "cio" },
  { name: "Rodney Moore", role: "Director IT Support", platform: "director" },
  { name: "Landon Davis", role: "IT Support Manager", platform: "manager" },
  { name: "Scott Cusack", role: "Manager Field Services", platform: "manager" },
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
  { name: "Amber Wallace", role: "Tier 1", platform: "tier-1" },
  { name: "Kyle Moreno", role: "Tier 1", platform: "tier-1" },
  { name: "Diego Velez", role: "Tier 1", platform: "tier-1" },
  { name: "Mohammad Wajiduddin", role: "Tier 1", platform: "tier-1" },
  { name: "Johan Cortes", role: "Tier 1", platform: "tier-1" },
  { name: "Daiver Bejar", role: "Tier 1", platform: "tier-1" },
  { name: "Carlos Tunarrosa", role: "Tier 1", platform: "tier-1" },
  { name: "Cristhian Reyes", role: "Tier 1", platform: "tier-1" },
  { name: "Eduardo Gutierrez", role: "Tier 1", platform: "tier-1" },
  { name: "Daniel Hall", role: "Field Services Specialist", platform: "field-service", location: "Richardson TX" },
  { name: "Eryk Phillips", role: "Field Service Specialist Lead", platform: "field-service", location: "Corpus Christie TX" },
  { name: "Milton Buell", role: "Field Service Specialist", platform: "field-service", location: "Houston TX" },
  { name: "TJ Recio", role: "Field Service Specialist", platform: "field-service", location: "Corpus Christie TX" },
  { name: "David Cardenas", role: "Field Service Technician", platform: "field-service", location: "Ft Worth 500 TX" },
  { name: "Michael Akinyemi", role: "Field Service Specialist Lead", platform: "field-service", location: "Ft Worth 500 TX" },
  { name: "Jose Cruz", role: "Field Service Specialist", platform: "field-service", location: "Ft. Worth, Burnett, TX" },
  { name: "Amanda Morgan", role: "Field Services Technician", platform: "field-service", location: "Metairie LA" },
  { name: "Jose Lopez", role: "Field Services Technician", platform: "field-service", location: "Atlanta GA" },
  { name: "Cedrick Johnson", role: "Field Services Technician", platform: "field-service", location: "Houston, TX" },
  { name: "Xavier Seay", role: "Field Services Technician", platform: "field-service", location: "Ft. Worth, Lake Street, TX" },
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