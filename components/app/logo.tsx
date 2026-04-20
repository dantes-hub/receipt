import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  showEnglish?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function Logo({ className, showEnglish = true, size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  }

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      {/* Bridge icon */}
      <svg
        viewBox="0 0 32 32"
        fill="none"
        className={cn(
          'shrink-0',
          size === 'sm' && 'w-6 h-6',
          size === 'md' && 'w-7 h-7',
          size === 'lg' && 'w-8 h-8'
        )}
      >
        {/* Bridge arch */}
        <path
          d="M4 22C4 22 8 10 16 10C24 10 28 22 28 22"
          stroke="#0F766E"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Bridge deck */}
        <path
          d="M2 22H30"
          stroke="#0F766E"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Receipt lines on the arch */}
        <path
          d="M12 16H20"
          stroke="#CA8A04"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M10 19H22"
          stroke="#CA8A04"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      
      <span className={cn('font-bold text-foreground', sizeClasses[size])}>
        發票橋
        {showEnglish && (
          <span className="text-muted-foreground font-normal ml-1.5">
            ReceiptBridge
          </span>
        )}
      </span>
    </div>
  )
}
