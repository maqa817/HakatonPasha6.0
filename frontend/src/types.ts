export type FoodCategory =
  | 'FRUIT'
  | 'VEGETABLE'
  | 'MEAT_POULTRY'
  | 'DAIRY'
  | 'BREAD_PASTRY'
  | 'EGGS'
  | 'CONFECTIONERY'
  | 'BEVERAGES'
  | 'OTHER'

export const FOOD_CATEGORY_LABELS: Record<FoodCategory, string> = {
  FRUIT: 'Meyvə',
  VEGETABLE: 'Tərəvəz',
  MEAT_POULTRY: 'Ət və toyuq',
  DAIRY: 'Süd məhsulları',
  BREAD_PASTRY: 'Çörək və pastry',
  EGGS: 'Yumurta',
  CONFECTIONERY: 'Şirniyyat',
  BEVERAGES: 'İçki',
  OTHER: 'Digər qida',
}

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

export interface UserRow {
  userId: string
  email: string
  firstName: string
  lastName: string
  filial: string
  role: string
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
