/**
 * useHoverAnimation Hook
 * Manages hover animations and transitions with state tracking
 */

import { useState, useCallback } from 'react'

export const useHoverAnimation = (options = {}) => {
  const {
    duration = 300,
    scale = 1.02,
    y = -4,
    enableGlow = false
  } = options

  const [isHovering, setIsHovering] = useState(false)

  const onMouseEnter = useCallback(() => {
    setIsHovering(true)
  }, [])

  const onMouseLeave = useCallback(() => {
    setIsHovering(false)
  }, [])

  const style = {
    transform: isHovering ? `translateY(${y}px) scale(${scale})` : 'translateY(0) scale(1)',
    transition: `all ${duration}ms cubic-bezier(0.34, 1.56, 0.64, 1)`,
    ...(enableGlow && isHovering && {
      boxShadow: '0 15px 35px -5px rgba(168, 85, 247, 0.2)'
    })
  }

  return {
    isHovering,
    onMouseEnter,
    onMouseLeave,
    style
  }
}

/**
 * useDragAnimation Hook
 * Manages drag state animations
 */
export const useDragAnimation = () => {
  const [isDragging, setIsDragging] = useState(false)

  const onDragStart = useCallback(() => {
    setIsDragging(true)
  }, [])

  const onDragEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  return {
    isDragging,
    onDragStart,
    onDragEnd,
    className: isDragging ? 'dragging' : ''
  }
}

/**
 * useEntranceAnimation Hook
 * Manages entrance animations with staggered delay
 */
export const useEntranceAnimation = (index = 0, baseDelay = 50) => {
  const style = {
    animationDelay: `${index * baseDelay}ms`
  }

  return {
    className: 'entrance-fade',
    style
  }
}

/**
 * useLoadingAnimation Hook
 * Manages loading state animations
 */
export const useLoadingAnimation = (isLoading = false) => {
  return {
    className: isLoading ? 'loading-pulse' : '',
    style: {
      opacity: isLoading ? 0.7 : 1,
      pointerEvents: isLoading ? 'none' : 'auto'
    }
  }
}

export default {
  useHoverAnimation,
  useDragAnimation,
  useEntranceAnimation,
  useLoadingAnimation
}
