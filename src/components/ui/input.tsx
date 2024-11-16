"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Search, AlertCircle } from "lucide-react"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
  icon?: React.ReactNode
  variant?: "default" | "quest" | "search"
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, icon, variant = "default", ...props }, ref) => {
    // 基本のスタイルクラス
    const baseStyles = "flex h-12 w-full rounded-lg border bg-background px-4 py-2 text-sm ring-offset-background transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"

    // バリアントに基づくスタイル
    const variantStyles = {
      default: "border-input hover:border-primary",
      quest: "border-2 border-amber-500 bg-black/10 text-amber-500 placeholder:text-amber-500/50 focus-visible:ring-amber-500",
      search: "pl-10 pr-4 border-slate-700 bg-slate-900/50 backdrop-blur-sm"
    }

    // エラー時のスタイル
    const errorStyles = "border-red-500 focus-visible:ring-red-500"

    return (
      <div className="relative w-full">
        {/* 検索アイコンの表示 */}
        {variant === "search" && (
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        )}

        {/* カスタムアイコンの表示 */}
        {icon && !props.disabled && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            {icon}
          </div>
        )}

        <input
          type={type}
          className={cn(
            baseStyles,
            variantStyles[variant],
            error && errorStyles,
            icon && "pl-10",
            className
          )}
          ref={ref}
          aria-invalid={error ? "true" : "false"}
          aria-errormessage={error ? `error-${props.id}` : undefined}
          {...props}
        />

        {/* エラーメッセージの表示 */}
        {error && (
          <div className="flex items-center gap-2 mt-2 text-red-500 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span id={`error-${props.id}`}>{error}</span>
          </div>
        )}
      </div>
    )
  }
)

Input.displayName = "Input"

export { Input }
// デフォルト
<Input placeholder="Enter your name" />

// クエストスタイル
<Input variant="quest" placeholder="Search for quests" />

// 検索バー
<Input variant="search" placeholder="Search..." />

// エラー表示
<Input 
  error="This field is required" 
  placeholder="Username" 
/>

// アイコン付き
<Input 
  icon={<Sword className="h-4 w-4" />} 
  placeholder="Enter weapon name" 
/>