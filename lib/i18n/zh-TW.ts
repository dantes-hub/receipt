export const zhTW = {
  // Brand
  brand: {
    name: '發票橋',
    nameEn: 'ReceiptBridge',
    tagline: '把發票交給會計師，前所未有的輕鬆',
    subTagline: '拍照 · 驗證 · 匯出 — 專為台灣中小企業設計',
  },

  // Navigation
  nav: {
    features: '產品特色',
    howItWorks: '運作方式',
    pricing: '定價',
    contact: '聯絡我們',
    login: '登入',
    tryFree: '免費試用',
    receipts: '發票',
    export: '匯出',
    settings: '設定',
  },

  // Landing page
  landing: {
    badge: '專為台灣中小企業 · 完整支援繁體中文發票',
    hero: {
      headline: '把發票交給會計師，前所未有的輕鬆',
      subheadline: '手機拍照上傳，AI 自動辨識 + 台灣專屬驗證，一鍵輸出會計師要的 Excel 格式。每月底少花 8 小時。',
      cta: '免費開始使用',
      ctaSecondary: '觀看 90 秒示範',
    },
    trust: {
      checksum: '統編 checksum 驗證',
      invoiceFormat: '發票號碼格式檢查',
      govVerify: '政府電子發票比對',
      dateConvert: '民國/西元自動轉換',
    },
    problem: {
      title: '熟悉這個畫面嗎？',
      items: [
        { icon: '📸', title: '每月底一疊發票', desc: '手動輸入到 Excel 累到凌晨' },
        { icon: '⏳', title: '會計師等你整理資料', desc: '你又要等他們回覆' },
        { icon: '💸', title: '漏掉一張發票', desc: '下個月多繳稅，得不償失' },
      ],
    },
    solution: {
      title: '發票橋 — 你的發票與會計師的橋樑',
      items: [
        { icon: '📱', title: '拍照上傳', desc: '手機拍一張，或批次上傳數十張。支援電子式、三聯式、手寫、QR Code 發票' },
        { icon: '✨', title: '自動驗證', desc: 'AI 辨識 + 台灣專屬驗證層：統編、發票號碼、稅額、日期格式全部檢查' },
        { icon: '📊', title: '一鍵匯出', desc: '會計師標準傳票格式。Excel、CSV、PDF 任選。零格式困擾' },
      ],
    },
    comparison: {
      title: '為什麼選擇發票橋？',
      subtitle: '市面上的發票辨識工具不少，但專為台灣設計的只有我們',
      features: [
        { name: '辨識準確度', us: '95%+ 搭配驗證層', others: '聲稱 99%，無驗證' },
        { name: '統編 checksum 驗證', us: true, others: false },
        { name: '發票號碼格式驗證', us: true, others: '部分支援' },
        { name: '民國/西元日期自動轉換', us: true, others: false },
        { name: '財政部電子發票平台比對', us: 'Beta', others: false },
        { name: '會計師標準傳票格式匯出', us: true, others: '需手動調整' },
        { name: '繁體中文介面', us: '原生設計', others: '多為翻譯' },
        { name: '手寫收據辨識', us: true, others: '效果不穩' },
        { name: '價格', us: '中小企業友善', others: '企業級報價' },
      ],
    },
    howItWorks: {
      title: '四步驟，輕鬆搞定',
      steps: [
        { step: 1, title: '註冊', desc: 'email 收到登入連結即可', time: '30秒' },
        { step: 2, title: '拍照上傳', desc: '手機或電腦都能用' },
        { step: 3, title: 'AI 辨識 + 自動驗證', desc: '看得見的驗證過程' },
        { step: 4, title: '匯出給會計師', desc: '一鍵下載 Excel 或 CSV' },
      ],
    },
    builtFor: {
      sme: {
        title: '給中小企業老闆',
        items: [
          '再也不用手動 key 發票到 Excel',
          '漏報發票的風險降到最低',
          '跟會計師對帳時間省一半',
        ],
      },
      accountant: {
        title: '給記帳士/會計師事務所',
        items: [
          '客戶上傳資料就到位',
          '格式統一，直接進會計系統',
          '每月可多接 3-5 家客戶',
        ],
      },
    },
    pricing: {
      title: '定價方式',
      desc: '試用期完全免費 · 歡迎中小企業與會計師事務所聯繫討論合作方案',
      cta: '聯絡我們',
    },
    faq: {
      title: '常見問題',
      items: [
        { q: '我的發票資料安全嗎？', a: '所有資料採用銀行等級加密傳輸與儲存，伺服器位於台灣，符合個資法規範。' },
        { q: '可以辨識手寫發票嗎？', a: '可以！我們的 AI 模型針對台灣手寫發票特別訓練，搭配驗證層確保準確度。' },
        { q: '支援哪些發票格式？', a: '支援電子發票、三聯式發票、二聯式發票、手寫發票、收據等所有台灣常見格式。' },
        { q: '我的會計師使用特定系統可以相容嗎？', a: '我們匯出的 Excel/CSV 格式適用於所有主流會計系統，如有特殊需求請聯繫我們。' },
        { q: '如果辨識錯誤怎麼辦？', a: '每個欄位都顯示辨識信心度，您可以直接在系統內編輯修正，修正後的資料會被記錄。' },
        { q: '有 API 可以整合嗎？', a: 'API 整合功能在我們的開發藍圖中，如有需求請聯繫我們洽談。' },
      ],
    },
  },

  // Receipt status
  status: {
    pending: '待處理',
    extracting: '辨識中',
    review: '待審核',
    confirmed: '已確認',
    error: '有錯誤',
  },

  // Categories
  categories: {
    dining: '餐飲',
    transport: '交通',
    office: '辦公',
    materials: '原物料',
    other: '其他',
    all: '全部',
  },

  // Validation messages
  validation: {
    checksumPass: 'Checksum 驗證通過',
    checksumFail: 'Checksum 錯誤 - 請確認輸入',
    formatCorrect: '格式正確',
    formatIncorrect: '格式錯誤',
    periodValid: '期別正確',
    taxRateMatch: '稅率一致',
    taxRateMismatch: '稅率不符',
    totalMatch: '金額計算正確',
    totalMismatch: '金額計算不符',
    dateConverted: '民國日期已轉換',
    govVerified: '平台資料一致',
    govMismatch: '部分欄位不符',
  },

  // Common actions
  actions: {
    upload: '上傳',
    save: '儲存',
    cancel: '取消',
    delete: '刪除',
    edit: '編輯',
    export: '匯出',
    confirm: '確認',
    back: '返回',
    next: '下一張',
    previous: '上一張',
    viewAll: '查看全部',
    download: '下載',
    search: '搜尋',
    logout: '登出',
    openMenu: '開啟選單',
    closeMenu: '關閉選單',
  },

  // Form labels
  fields: {
    vendorName: '廠商名稱',
    taxId: '統編',
    invoiceNumber: '發票號碼',
    invoiceDate: '發票日期',
    subtotal: '未稅金額',
    tax: '稅額',
    total: '總金額',
    category: '分類',
    notes: '備註',
    email: 'Email',
    password: '密碼',
    name: '姓名',
    company: '公司名稱',
    phone: '電話',
    address: '公司地址',
  },

  // Dashboard
  dashboard: {
    welcome: '您好，{name}。本月已處理 {count} 張發票，為您節省 {minutes} 分鐘。',
    filesUnit: '張',
    greetingFallback: '使用者',
    processingFiles: '正在處理 {count} 個檔案...',
    uploadingAndExtracting: '上傳並辨識中...',
    uploadDone: '完成',
    waitingUpload: '等待上傳',
    selectFiles: '選擇檔案',
    takePhoto: '拍照上傳',
    stats: {
      monthlyReceipts: '本月發票數',
      pending: '待審核',
      confirmed: '已確認',
      monthlyTotal: '本月總金額',
    },
    upload: {
      title: '拖曳發票到這裡，或點擊上傳',
      subtitle: '手機請直接點擊開啟相機',
      formats: '支援 JPG、PNG、HEIC、PDF',
    },
    recentReceipts: '最近發票',
  },

  // Export page
  export: {
    step1: {
      title: '選擇資料',
      dateRange: '日期範圍',
      from: '從',
      to: '到',
      confirmedOnly: '只匯出已確認',
      preview: '將匯出 {count} 張發票，總金額 NT$ {amount}',
    },
    step2: {
      title: '選擇格式',
      xlsx: 'Excel (.xlsx)',
      xlsxDesc: '會計師標準傳票格式',
      csv: 'CSV (UTF-8 with BOM)',
      csvDesc: '適合匯入其他系統',
      pdf: 'PDF 報表',
      pdfDesc: '含驗證摘要，適合存檔',
      zip: 'ZIP',
      zipDesc: '含所有發票原始圖片',
      recommended: '推薦',
    },
    step3: {
      title: '自定義欄位',
    },
    step4: {
      title: '預覽',
      fullExport: '完整匯出將包含 {count} 筆資料',
    },
    downloadButton: '下載 {format} 檔案',
    tip: '格式符合台灣記帳士事務所標準傳票格式。若您的會計師使用特定會計系統，請於 設定 > 會計師資料 中指定。',
    optional: '選填',
    comingSoon: '即將推出',
    summary: '將匯出 {count} 張發票，總金額',
  },

  // Settings
  settings: {
    saved: '已儲存',
    saveChanges: '儲存變更',
    tabs: {
      profile: '個人資料',
      company: '公司資料',
      accountant: '會計師資料',
      categories: '分類設定',
      notifications: '通知',
      security: '帳戶安全',
      danger: '危險操作區',
    },
    profile: {
      description: '管理您的個人資訊',
      emailReadOnly: 'Email 為登入帳號，無法修改',
    },
    company: {
      description: '設定您的公司基本資訊，用於匯出報表標題',
    },
    accountant: {
      description: '設定您的會計師聯絡資訊與偏好',
      name: '會計師姓名',
      firm: '會計師事務所',
      email: '會計師 email',
      preferredFormat: '偏好匯出格式',
      autoSend: '每月自動寄送匯出給會計師',
      comingSoon: '即將推出',
    },
    categories: {
      description: '目前使用系統預設分類',
      comingSoon: '自定義分類功能即將推出',
    },
    notifications: {
      description: '管理您的通知偏好',
      emailLabel: 'Email 通知',
      emailDesc: '收到重要更新時以 email 通知',
      monthlyLabel: '每月報告',
      monthlyDesc: '每月自動寄送發票統計報告',
    },
    security: {
      description: '管理您的帳戶安全設定',
      emailLogin: '登入方式',
      magicLinkOnly: '使用 Magic Link 無密碼登入',
      active: '使用中',
    },
    danger: {
      description: '這些操作無法復原，請謹慎操作',
      deleteTitle: '刪除帳戶',
      deleteDesc: '永久刪除您的帳戶及所有資料',
      deleteButton: '刪除帳戶',
    },
  },

  // Login
  login: {
    title: '登入 發票橋',
    subtitle: '第一次使用也沒問題，直接輸入 email 即可註冊',
    emailPlaceholder: '您的 email',
    submit: '傳送登入連結',
    sent: '連結已寄出，請至信箱點擊登入',
    backHome: '回首頁',
    privacy: '隱私權政策',
  },

  // Footer
  footer: {
    product: '產品',
    resources: '資源',
    legal: '法律',
    contact: '聯絡',
    description: '專為台灣中小企業設計的發票 AI 辨識工具',
    copyright: '© 2026 ReceiptBridge · Made in Taiwan',
    madeBy: '由台中打造',
    terms: '服務條款',
    privacy: '隱私權政策',
    help: '幫助中心',
    blog: '部落格',
    apiDocs: 'API 文件',
  },

  // Empty states
  empty: {
    receipts: '還沒有發票',
    receiptsAction: '點擊右上角上傳開始',
  },

  // Confidence
  confidence: {
    high: '辨識信心: 高',
    medium: '辨識信心: 中',
    low: '辨識信心: 低',
  },

  // Error messages
  errors: {
    uploadFailed: '上傳失敗，請檢查網路連線後再試',
    saveFailed: '儲存失敗，請稍後再試',
    loadFailed: '載入失敗，請重新整理頁面',
    invalidFormat: '檔案格式不支援',
  },

  receiptsPage: {
    monthLabel: '月份',
    allStatuses: '顯示本月全部狀態',
    thumbnail: '縮圖',
    date: '日期',
    vendor: '廠商',
    amount: '金額',
    totalCount: '共 {count} 張發票',
    emptyDescription: '點擊上傳開始建立第一筆資料',
    uploadReceipt: '上傳發票',
    unrecognized: '未辨識',
    processing: '待辨識',
  },

  review: {
    backToList: '返回列表',
    receiptPrefix: '發票',
    pendingRecognition: '待辨識',
    previewPdf: 'PDF 檔案預覽',
    previewUnavailable: '無法載入檔案預覽',
    openOriginalFile: '開啟原始檔案',
    pdfHint: '目前請在新分頁開啟 PDF 檢視原始內容。',
    previewHint: '請稍後再試，或直接開啟原始檔案。',
    uploadedAt: '上傳於',
    validationProgress: '驗證進度',
    validatedFields: '{count}/{total} 欄位已驗證',
    basicInfo: '基本資訊',
    amountInfo: '金額資訊',
    otherInfo: '其他',
    optionalPlaceholder: '選填',
    saveAndNext: '確認並下一張',
    saving: '儲存中...',
    keyboardConfirm: '確認',
    keyboardCancel: '取消',
    keyboardBrowse: '瀏覽',
  },
}
