"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

// ボタンのバリエーションを定義
const buttonVariants = cva(
  // ベースとなるスタイル
  "inline-flex items-center justify-center rounded-lg text-sm font-bold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:translate-y-0.5",
  {
    variants: {
      variant: {
        // プライマリーボタン（メインアクション用）
        primary: "bg-gradient-to-b from-amber-400 to-amber-600 text-primary-foreground hover:from-amber-500 hover:to-amber-700 border-b-4 border-amber-700 hover:border-amber-800 shadow-lg",
        
        // セカンダリーボタン（サブアクション用）
        secondary: "bg-gradient-to-b from-slate-400 to-slate-600 text-secondary-foreground hover:from-slate-500 hover:to-slate-700 border-b-4 border-slate-700 hover:border-slate-800 shadow-lg",
        
        // デンジャーボタン（危険なアクション用）
        destructive: "bg-gradient-to-b from-red-500 to-red-700 text-destructive-foreground hover:from-red-600 hover:to-red-800 border-b-4 border-red-800 hover:border-red-900 shadow-lg",
        
        // アウトラインボタン
        outline: "border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-sm",
        
        // ゴーストボタン
        ghost: "hover:bg-accent hover:text-accent-foreground",
        
        // リンクボタン
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 rounded-md",
        lg: "h-12 px-8 rounded-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

// ボタンのプロパティの型定義
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

// ボタンコンポーネント
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </>
        ) : (
          children
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
// 通常のボタン
<Button>Start Quest</Button>

// ローディング状態
<Button loading>Processing</Button>

// 大きいサイズのデンジャーボタン
<Button variant="destructive" size="lg">
  Abandon Quest
</Button>