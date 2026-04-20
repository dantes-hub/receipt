export const en = {
  // Brand
  brand: {
    name: 'ReceiptBridge',
    nameEn: 'ReceiptBridge',
    tagline: 'The bridge from messy receipts to clean accounting.',
    subTagline: 'Snap · Verify · Export — Built for Taiwan SMEs',
  },

  // Navigation
  nav: {
    features: 'Features',
    howItWorks: 'How It Works',
    pricing: 'Pricing',
    contact: 'Contact',
    login: 'Login',
    tryFree: 'Try Free',
    receipts: 'Receipts',
    export: 'Export',
    settings: 'Settings',
  },

  // Landing page
  landing: {
    badge: 'Built for Taiwan SMEs · Full Traditional Chinese support',
    hero: {
      headline: 'The bridge from messy receipts to clean accounting.',
      subheadline: 'Snap a photo, AI extracts fields with Taiwan-specific validation, export in accountant-ready format. Save 8 hours every month.',
      cta: 'Start Free',
      ctaSecondary: 'Watch 90s Demo',
    },
    trust: {
      checksum: 'Tax ID checksum verification',
      invoiceFormat: 'Invoice number format check',
      govVerify: 'Government e-invoice verification',
      dateConvert: 'ROC/CE date conversion',
    },
    problem: {
      title: 'Sound familiar?',
      items: [
        { icon: '📸', title: 'Stack of receipts at month end', desc: 'Manual entry into Excel until midnight' },
        { icon: '⏳', title: 'Accountant waiting for your data', desc: 'And you waiting for their response' },
        { icon: '💸', title: 'Missing one receipt', desc: 'Extra taxes next month, money lost' },
      ],
    },
    solution: {
      title: 'ReceiptBridge — Your bridge to the accountant',
      items: [
        { icon: '📱', title: 'Snap & Upload', desc: 'Take a photo or batch upload dozens. Supports electronic, triplicate, handwritten, QR code invoices' },
        { icon: '✨', title: 'Auto Verification', desc: 'AI extraction + Taiwan validation layer: Tax ID, invoice number, tax amount, date format all checked' },
        { icon: '📊', title: 'One-Click Export', desc: 'Accountant-standard voucher format. Excel, CSV, PDF. Zero formatting hassle' },
      ],
    },
    comparison: {
      title: 'Why ReceiptBridge?',
      subtitle: 'Many receipt tools exist, but only we are built for Taiwan',
      features: [
        { name: 'Recognition Accuracy', us: '95%+ with validation', others: 'Claims 99%, no validation' },
        { name: 'Tax ID checksum verification', us: true, others: false },
        { name: 'Invoice number format check', us: true, others: 'Partial' },
        { name: 'ROC/CE date auto-conversion', us: true, others: false },
        { name: 'Gov e-invoice platform check', us: 'Beta', others: false },
        { name: 'Accountant voucher format export', us: true, others: 'Manual adjustment needed' },
        { name: 'Traditional Chinese UI', us: 'Native design', others: 'Mostly translated' },
        { name: 'Handwritten receipt recognition', us: true, others: 'Unstable' },
        { name: 'Pricing', us: 'SME-friendly', others: 'Enterprise pricing' },
      ],
    },
    howItWorks: {
      title: 'Four steps, done',
      steps: [
        { step: 1, title: 'Sign Up', desc: 'Get login link via email', time: '30 sec' },
        { step: 2, title: 'Upload', desc: 'Phone or computer' },
        { step: 3, title: 'AI + Verification', desc: 'Visible validation process' },
        { step: 4, title: 'Export', desc: 'One-click Excel or CSV' },
      ],
    },
    builtFor: {
      sme: {
        title: 'For SME Owners',
        items: [
          'No more manual receipt entry',
          'Minimize missed receipt risk',
          'Cut reconciliation time in half',
        ],
      },
      accountant: {
        title: 'For Accountants',
        items: [
          'Client data arrives ready',
          'Unified format, straight to your system',
          'Handle 3-5 more clients monthly',
        ],
      },
    },
    pricing: {
      title: 'Pricing',
      desc: 'Free trial · Contact us to discuss partnership plans for SMEs and accounting firms',
      cta: 'Contact Us',
    },
    faq: {
      title: 'FAQ',
      items: [
        { q: 'Is my receipt data secure?', a: 'All data is encrypted with bank-grade security, servers located in Taiwan, compliant with privacy regulations.' },
        { q: 'Can you recognize handwritten receipts?', a: 'Yes! Our AI model is specially trained for Taiwan handwritten receipts, with validation layer for accuracy.' },
        { q: 'What receipt formats are supported?', a: 'Electronic invoices, triplicate invoices, duplicate invoices, handwritten receipts, and all common Taiwan formats.' },
        { q: 'Compatible with my accountant system?', a: 'Our Excel/CSV export works with all major accounting systems. Contact us for special requirements.' },
        { q: 'What if recognition is wrong?', a: 'Each field shows confidence level, you can edit directly in the system, corrections are logged.' },
        { q: 'API available?', a: 'API integration is on our roadmap. Contact us to discuss your needs.' },
      ],
    },
  },

  // Receipt status
  status: {
    pending: 'Pending',
    extracting: 'Extracting',
    review: 'Needs Review',
    confirmed: 'Confirmed',
    error: 'Error',
  },

  // Categories
  categories: {
    dining: 'Dining',
    transport: 'Transport',
    office: 'Office',
    materials: 'Materials',
    other: 'Other',
    all: 'All',
  },

  // Validation messages
  validation: {
    checksumPass: 'Checksum verified',
    checksumFail: 'Checksum error - please verify',
    formatCorrect: 'Format correct',
    formatIncorrect: 'Format error',
    periodValid: 'Period valid',
    taxRateMatch: 'Tax rate matches',
    taxRateMismatch: 'Tax rate mismatch',
    totalMatch: 'Total calculation correct',
    totalMismatch: 'Total calculation mismatch',
    dateConverted: 'ROC date converted',
    govVerified: 'Platform data matches',
    govMismatch: 'Some fields differ',
  },

  // Common actions
  actions: {
    upload: 'Upload',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    export: 'Export',
    confirm: 'Confirm',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    viewAll: 'View All',
    download: 'Download',
    search: 'Search',
    logout: 'Log out',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
  },

  // Form labels
  fields: {
    vendorName: 'Vendor Name',
    taxId: 'Tax ID',
    invoiceNumber: 'Invoice Number',
    invoiceDate: 'Invoice Date',
    subtotal: 'Subtotal',
    tax: 'Tax',
    total: 'Total',
    category: 'Category',
    notes: 'Notes',
    email: 'Email',
    password: 'Password',
    name: 'Name',
    company: 'Company',
    phone: 'Phone',
    address: 'Business Address',
  },

  // Dashboard
  dashboard: {
    welcome: 'Hello, {name}. Processed {count} receipts this month, saved you {minutes} minutes.',
    filesUnit: '',
    greetingFallback: 'User',
    processingFiles: 'Processing {count} files...',
    uploadingAndExtracting: 'Uploading and extracting...',
    uploadDone: 'Done',
    waitingUpload: 'Waiting to upload',
    selectFiles: 'Choose Files',
    takePhoto: 'Take Photo',
    stats: {
      monthlyReceipts: 'Monthly Receipts',
      pending: 'Pending Review',
      confirmed: 'Confirmed',
      monthlyTotal: 'Monthly Total',
    },
    upload: {
      title: 'Drag receipts here, or click to upload',
      subtitle: 'On mobile, tap to open camera',
      formats: 'Supports JPG, PNG, HEIC, PDF',
    },
    recentReceipts: 'Recent Receipts',
  },

  // Export page
  export: {
    step1: {
      title: 'Select Data',
      dateRange: 'Date Range',
      from: 'From',
      to: 'To',
      confirmedOnly: 'Confirmed only',
      preview: 'Will export {count} receipts, total NT$ {amount}',
    },
    step2: {
      title: 'Select Format',
      xlsx: 'Excel (.xlsx)',
      xlsxDesc: 'Accountant standard voucher format',
      csv: 'CSV (UTF-8 with BOM)',
      csvDesc: 'For importing to other systems',
      pdf: 'PDF Report',
      pdfDesc: 'With validation summary, for archiving',
      zip: 'ZIP',
      zipDesc: 'Includes all original receipt images',
      recommended: 'Recommended',
    },
    step3: {
      title: 'Customize Fields',
    },
    step4: {
      title: 'Preview',
      fullExport: 'Full export will include {count} records',
    },
    downloadButton: 'Download {format} File',
    tip: 'Format meets Taiwan accountant voucher standards. If your accountant uses a specific system, specify in Settings > Accountant Info.',
    optional: 'Optional',
    comingSoon: 'Coming Soon',
    summary: 'Will export {count} receipts, total',
  },

  // Settings
  settings: {
    saved: 'Saved',
    saveChanges: 'Save Changes',
    tabs: {
      profile: 'Profile',
      company: 'Company Info',
      accountant: 'Accountant Info',
      categories: 'Categories',
      notifications: 'Notifications',
      security: 'Security',
      danger: 'Danger Zone',
    },
    profile: {
      description: 'Manage your personal information',
      emailReadOnly: 'Email is your login account and cannot be changed',
    },
    company: {
      description: 'Set your company details, used in export report headers',
    },
    accountant: {
      description: 'Set your accountant contact info and preferences',
      name: 'Accountant Name',
      firm: 'Accounting Firm',
      email: 'Accountant Email',
      preferredFormat: 'Preferred Export Format',
      autoSend: 'Auto-send monthly export to accountant',
      comingSoon: 'Coming Soon',
    },
    categories: {
      description: 'Currently using default system categories',
      comingSoon: 'Custom categories coming soon',
    },
    notifications: {
      description: 'Manage your notification preferences',
      emailLabel: 'Email Notifications',
      emailDesc: 'Receive email notifications for important updates',
      monthlyLabel: 'Monthly Report',
      monthlyDesc: 'Auto-send monthly receipt summary report',
    },
    security: {
      description: 'Manage your account security settings',
      emailLogin: 'Login Method',
      magicLinkOnly: 'Passwordless login via Magic Link',
      active: 'Active',
    },
    danger: {
      description: 'These actions cannot be undone. Proceed with care.',
      deleteTitle: 'Delete Account',
      deleteDesc: 'Permanently delete your account and all data',
      deleteButton: 'Delete Account',
    },
  },

  // Login
  login: {
    title: 'Login to ReceiptBridge',
    subtitle: 'First time? Just enter your email to sign up',
    emailPlaceholder: 'Your email',
    submit: 'Send Login Link',
    sent: 'Link sent, please check your inbox',
    backHome: 'Back to Home',
    privacy: 'Privacy Policy',
  },

  // Footer
  footer: {
    product: 'Product',
    resources: 'Resources',
    legal: 'Legal',
    contact: 'Contact',
    description: 'AI receipt extraction built for Taiwan SMEs',
    copyright: '© 2026 ReceiptBridge · Made in Taiwan',
    madeBy: 'Built in Taichung',
    terms: 'Terms of Service',
    privacy: 'Privacy Policy',
    help: 'Help Center',
    blog: 'Blog',
    apiDocs: 'API Docs',
  },

  // Empty states
  empty: {
    receipts: 'No receipts yet',
    receiptsAction: 'Click upload in the top right to start',
  },

  // Confidence
  confidence: {
    high: 'Confidence: High',
    medium: 'Confidence: Medium',
    low: 'Confidence: Low',
  },

  // Error messages
  errors: {
    uploadFailed: 'Upload failed, please check your connection and try again',
    saveFailed: 'Save failed, please try again later',
    loadFailed: 'Load failed, please refresh the page',
    invalidFormat: 'Unsupported file format',
  },

  receiptsPage: {
    monthLabel: 'Month',
    allStatuses: 'Showing all statuses this month',
    thumbnail: 'Thumb',
    date: 'Date',
    vendor: 'Vendor',
    amount: 'Amount',
    totalCount: '{count} receipts total',
    emptyDescription: 'Upload your first receipt to get started',
    uploadReceipt: 'Upload Receipt',
    unrecognized: 'Unrecognized',
    processing: 'Processing',
  },

  review: {
    backToList: 'Back to List',
    receiptPrefix: 'Receipt',
    pendingRecognition: 'Processing',
    previewPdf: 'PDF Preview',
    previewUnavailable: 'Preview unavailable',
    openOriginalFile: 'Open Original File',
    pdfHint: 'Open the PDF in a new tab to view the original content.',
    previewHint: 'Please try again later, or open the original file directly.',
    uploadedAt: 'Uploaded at',
    validationProgress: 'Validation Progress',
    validatedFields: '{count}/{total} fields validated',
    basicInfo: 'Basic Info',
    amountInfo: 'Amounts',
    otherInfo: 'Other',
    optionalPlaceholder: 'Optional',
    saveAndNext: 'Confirm and Next',
    saving: 'Saving...',
    keyboardConfirm: 'Confirm',
    keyboardCancel: 'Cancel',
    keyboardBrowse: 'Browse',
  },
}
