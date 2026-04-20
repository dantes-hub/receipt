const MOEA_API_URL = 'https://data.gcis.nat.gov.tw/od/data/api/236EE382-4942-41A9-BD03-CA0709025E7C'
const MOEA_TIMEOUT_MS = 5000

export interface MoeaCompany {
  ubn: string
  name: string
  status: string
  isActive: boolean
}

interface MoeaApiRow {
  Business_Accounting_NO: string
  Company_Name: string
  Company_Status_Desc: string
  Company_Status: string
}

export interface MoeaLookupResult {
  found: boolean
  company?: MoeaCompany
  error?: string
}

export async function lookupCompanyByUbn(ubn: string): Promise<MoeaLookupResult> {
  const url = new URL(MOEA_API_URL)
  url.searchParams.set('$format', 'json')
  url.searchParams.set('$filter', `Business_Accounting_NO eq ${ubn}`)
  url.searchParams.set('$skip', '0')
  url.searchParams.set('$top', '1')

  try {
    const res = await fetch(url.toString(), {
      signal: AbortSignal.timeout(MOEA_TIMEOUT_MS),
      headers: { Accept: 'application/json' },
    })

    if (!res.ok) {
      return { found: false, error: `MOEA API returned ${res.status}` }
    }

    const text = await res.text()
    if (!text || text.trim() === '') return { found: false }

    let data: MoeaApiRow[]
    try {
      data = JSON.parse(text)
    } catch {
      return { found: false, error: '政府資料庫回傳格式錯誤' }
    }

    if (!Array.isArray(data) || data.length === 0) {
      return { found: false }
    }

    const row = data[0]
    return {
      found: true,
      company: {
        ubn: row.Business_Accounting_NO,
        name: row.Company_Name,
        status: row.Company_Status_Desc,
        isActive: row.Company_Status === '01',
      },
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'TimeoutError') {
      return { found: false, error: 'MOEA API 請求逾時' }
    }
    return { found: false, error: error instanceof Error ? error.message : 'MOEA API 錯誤' }
  }
}
