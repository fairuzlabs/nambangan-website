"use client"

import React, { useState } from 'react'

const PLACEHOLDER = (
  <div className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 gap-2">
    <svg width="40" height="40" viewBox="0 0 88 88" xmlns="http://www.w3.org/2000/svg" stroke="#9ca3af" strokeLinejoin="round" opacity=".6" fill="none" strokeWidth="3.7">
      <rect x="16" y="16" width="56" height="56" rx="6"/>
      <path d="m16 58 16-18 32 32"/>
      <circle cx="53" cy="35" r="7"/>
    </svg>
    <span className="text-xs text-gray-400 font-medium">Tidak ada gambar</span>
  </div>
)

export function ImageWithFallback(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [didError, setDidError] = useState(false)
  const { src, alt, style, className, ...rest } = props

  // Show placeholder if src is empty or falsy
  if (!src) {
    return (
      <div className={`inline-block ${className ?? ''}`} style={style}>
        {PLACEHOLDER}
      </div>
    )
  }

  return didError ? (
    <div
      className={`inline-block bg-gradient-to-br from-gray-100 to-gray-200 text-center align-middle ${className ?? ''}`}
      style={style}
    >
      {PLACEHOLDER}
    </div>
  ) : (
    <img src={src} alt={alt} className={className} style={style} {...rest} onError={() => setDidError(true)} />
  )
}
