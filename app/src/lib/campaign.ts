export type RewardTier = 'blue' | 'green' | 'yellow' | 'pink' | 'purple' | 'white'
export type RewardKind = 'main' | 'bonus'
export type RewardStatus = 'unused' | 'used' | 'expired'

export interface TrackingParams {
  utmSource: string | null
  utmMedium: string | null
  utmCampaign: string | null
  branch: string | null
  qrId: string | null
}

export interface RewardTemplate {
  id: string
  tier: RewardTier
  name: string
  description: string
  amount: number
  weight: number
  stock: number
  image: string
  terms: string
}

export interface Reward {
  id: string
  customerId?: string
  templateId: string
  type: RewardKind
  tier: RewardTier
  name: string
  description: string
  amount: number
  expiryDate: string
  status: RewardStatus
  code: string
  terms: string
  image: string
  issuedAt: string
  usedAt?: string
}

export interface CustomerProfile {
  name: string
  phone: string
  ageRange?: string
  visitReason?: string
  consentMarketing: boolean
  registeredAt: string
}

export interface CampaignEvent {
  type: 'scan' | 'register' | 'draw' | 'friend' | 'share' | 'redeem'
  timestamp: string
  branch: string | null
  qrId: string | null
}

export const pharmacyProfile = {
  name: 'CNY HEALTHCARE',
  lineHandle: '@clinicya',
  phone: '099-191-5416',
  campaignTitle: 'ลูกค้าใหม่ แอด LINE เล่นกาชารับของรางวัล',
  campaignSubtitle:
    'แอด LINE @clinicya เพื่อเก็บสิทธิ์ของรางวัลไว้ใน Wallet และรับข่าวสารจาก CNY HEALTHCARE',
}

export const visitReasonOptions = ['ลูกค้าใหม่']

export function normalizeThaiPhone(input: string) {
  const digits = input.replace(/\D/g, '')
  if (digits.startsWith('66') && digits.length === 11) {
    return `0${digits.slice(2)}`
  }
  return digits
}

export function isValidThaiMobile(input: string) {
  return /^0[689]\d{8}$/.test(normalizeThaiPhone(input))
}

export function createReward(
  template: RewardTemplate,
  type: RewardKind = 'main',
  now = new Date(),
  sequence = 1,
): Reward {
  const expiry = new Date(now)
  expiry.setDate(expiry.getDate() + 30)

  return {
    id: `${type}-${template.id}-${now.getTime()}-${sequence}`,
    templateId: template.id,
    type,
    tier: template.tier,
    name: template.name,
    description: template.description,
    amount: template.amount,
    expiryDate: expiry.toISOString().slice(0, 10),
    status: 'unused',
    code: `RX-JYP-${String(sequence).padStart(4, '0')}`,
    terms: template.terms,
    image: template.image,
    issuedAt: now.toISOString(),
  }
}

export function formatBaht(amount: number) {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatThaiDate(dateISO: string) {
  const datePart = String(dateISO ?? '').match(/^(\d{4}-\d{2}-\d{2})/)?.[1]
  const date = datePart ? new Date(`${datePart}T00:00:00+07:00`) : new Date(dateISO)

  if (Number.isNaN(date.getTime())) return 'ไม่ระบุ'

  return new Intl.DateTimeFormat('th-TH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export function createEvent(
  type: CampaignEvent['type'],
  tracking: TrackingParams,
  now = new Date(),
): CampaignEvent {
  return {
    type,
    timestamp: now.toISOString(),
    branch: tracking.branch,
    qrId: tracking.qrId,
  }
}

export function getBranchLabel(tracking: TrackingParams) {
  if (tracking.branch) return `สาขา ${tracking.branch}`
  if (tracking.qrId) return `QR ${tracking.qrId}`
  return 'แคมเปญหลัก'
}

export function countEvents(events: CampaignEvent[], type: CampaignEvent['type']) {
  return events.filter((event) => event.type === type).length
}
