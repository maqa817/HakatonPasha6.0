export interface LoginResponse {
  accessToken: string
  expiresInSeconds: number
  role: string
  displayName: string
}

export const FILIAL_LIST = [
  'Bravo Koroğlu',
  'Bravo 20 Yanvar',
  'Bravo Gənclik Mall',
  'Bravo Dəniz Mall',
  'Bravo Əhmədli',
  'Bravo 28 Mall',
  'Bravo Babək',
  'Bravo Şüvəlan',
  'Bravo Xırdalan',
  'Bravo Sumqayıt',
]

export const ADMIN_CATEGORIES = [
  'Meyvə və tərəvəz',
  'Ət və dəniz məhsulları',
  'Süd məhsulları və pendirlər',
  'Quru qida və baxliyatlar',
  'Qəlyanaltılar və şirniyyatlar',
  'İçkilər',
  'Ev və gigiyena məhsulları',
  'Şəxsi qulluq və kosmetika',
  'Uşaq aləmi',
  'Ev əşyaları və tekstil',
  'Geyim',
]

export interface UserRow {
  userId: string
  email: string
  firstName: string
  lastName: string
  filial: string
  role: string
  category?: string
  active: boolean
}

export interface DepartmentResponse {
  id: string
  storeId: string
  name: string
  headName: string
  categories: string[]
}

export interface StoreRow {
  id: string
  name: string
  city: string
  regionCode: string
  departments: DepartmentResponse[]
}

export interface DepartmentOverview {
  departmentId: string
  departmentName: string
  headName: string
  categories: string[]
  wastePercent: number
  wasteVsTargetMultiplier: number
  criticalProductAlerts: number
  statusKey: string
}

export interface StoreOverview {
  storeId: string
  storeName: string
  city: string
  regionCode: string
  avgWastePercent: number
  criticalAlerts: number
  status: string
  departments: DepartmentOverview[]
}

export interface OverviewSummary {
  totalStores: number
  monthlyGoodsReceptionsMock: number
  totalCriticalAlerts: number
  trendNoteAz: string
  stores: StoreOverview[]
}
