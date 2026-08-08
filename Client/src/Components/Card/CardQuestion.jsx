import React from 'react'
import { cn } from '@/lib/utils'
import { ThumbsUp, MessageSquare } from 'lucide-react'

export default function CardQuestion({ height, image = null, text, title, icon = null, iconStyle, likes, responses, style, className }) {
  return (
    <div
      className={cn(
        'group cursor-pointer rounded-xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card',
        className
      )}
      style={{ height, ...style }}
      tabIndex={0}
    >
      {image && (
        <img src={image} alt="card-img" className="mb-4 h-32 w-full rounded-lg object-cover" />
      )}
      <h3 className="text-base font-semibold text-foreground transition-colors group-hover:text-primary">
        {title}
      </h3>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
      <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          {icon && <span style={iconStyle}>{icon}</span>}
          <ThumbsUp className="h-3.5 w-3.5" />
          <span>{likes} j'aime</span>
        </div>
        <div className="flex items-center gap-1.5">
          <MessageSquare className="h-3.5 w-3.5" />
          <span>{responses} réponses</span>
        </div>
      </div>
    </div>
  )
}