"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// バッジのバリエーションを定義
const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow-sm shadow-primary/50",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground shadow-sm shadow-secondary/50",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow-sm shadow-destructive/50",
        outline: "text-foreground border border-input",
        // ゲーム風のカスタムバリアント
        quest: "bg-gradient-to-r from-amber-500 to-yellow-500 text-black border-2 border-amber-700 shadow-lg shadow-amber-500/50",
        legendary: "bg-gradient-to-r from-purple-600 to-pink-500 text-white border-2 border-purple-800 shadow-lg shadow-purple-500/50",
        rare: "bg-gradient-to-r from-blue-500 to-cyan-400 text-white border-2 border-blue-700 shadow-lg shadow-blue-500/50",
        epic: "bg-gradient-to-r from-indigo-600 to-purple-500 text-white border-2 border-indigo-800 shadow-lg shadow-indigo-500/50",
        common: "bg-gradient-to-r from-slate-500 to-slate-400 text-white border-2 border-slate-700 shadow-lg shadow-slate-500/50",
      },
      animation: {
        none: "",
        pulse: "animate-pulse",
        bounce: "animate-bounce",
        glow: "animate-glow",
      },
    },
    defaultVariants: {
      variant: "default",
      animation: "none",
    },
  }
)

// バッジのプロップスを定義
export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  children: React.ReactNode
}

// アクセシビリティを考慮したバッジコンポーネント
function Badge({
  className,
  variant,
  animation,
  children,
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant, animation }), className)}
      role="status"
      aria-label={`${variant} badge`}
      {...props}
    >
      {children}
    </div>
  )
}

// アニメーション用のキーフレームをグローバルCSSに追加する必要がある
// tailwind.config.jsに以下を追加:
/*
extend: {
  keyframes: {
    glow: {
      '0%, 100%': { opacity: 1 },
      '50%': { opacity: 0.6 }
    }
  },
  animation: {
    glow: 'glow 2s ease-in-out infinite'
  }
}
*/

export { Badge, badgeVariants }
// 通常のバッジ
<Badge>Default</Badge>

// レアアイテムバッジ
<Badge variant="rare" animation="glow">
  Rare Item
</Badge>

// レジェンダリークエストバッジ
<Badge variant="legendary" animation="pulse">
  Legendary Quest
</Badge>