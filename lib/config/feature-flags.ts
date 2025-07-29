/**
 * Feature Flags Configuration
 * 
 * Centralized feature flag management for Task Master application.
 * All flags are controlled via environment variables with TASKMASTER_ prefix.
 */

export const featureFlags = {
  /**
   * Authentication System
   * Controls whether user authentication is enabled
   * Environment: TASKMASTER_ENABLE_AUTH
   */
  auth: {
    enabled: process.env.TASKMASTER_ENABLE_AUTH === 'true',
    // Future auth-related flags can be added here
    requireEmailVerification: process.env.TASKMASTER_AUTH_REQUIRE_EMAIL_VERIFICATION === 'true',
    allowGuestAccess: process.env.TASKMASTER_AUTH_ALLOW_GUEST === 'true',
  },

  /**
   * Analytics & Tracking
   * Controls analytics and user tracking features
   * Environment: TASKMASTER_ENABLE_ANALYTICS
   */
  analytics: {
    enabled: process.env.TASKMASTER_ENABLE_ANALYTICS === 'true',
    trackUserActions: process.env.TASKMASTER_ANALYTICS_TRACK_ACTIONS === 'true',
  },

  /**
   * Beta Features
   * Controls experimental or beta features
   * Environment: TASKMASTER_ENABLE_BETA_FEATURES
   */
  beta: {
    enabled: process.env.TASKMASTER_ENABLE_BETA_FEATURES === 'true',
    advancedKanban: process.env.TASKMASTER_BETA_ADVANCED_KANBAN === 'true',
    aiSuggestions: process.env.TASKMASTER_BETA_AI_SUGGESTIONS === 'true',
  },

  /**
   * Development & Debug Features
   * Controls development-only features
   * Environment: TASKMASTER_ENABLE_DEBUG
   */
  development: {
    debugMode: process.env.TASKMASTER_DEBUG_MODE === 'true',
    showPerformanceMetrics: process.env.TASKMASTER_DEBUG_PERFORMANCE === 'true',
    enableDevTools: process.env.NODE_ENV === 'development',
  },
} as const

/**
 * Type definitions for feature flags
 */
export type FeatureFlag = keyof typeof featureFlags
export type AuthFeatureFlag = keyof typeof featureFlags.auth
export type AnalyticsFeatureFlag = keyof typeof featureFlags.analytics
export type BetaFeatureFlag = keyof typeof featureFlags.beta
export type DevelopmentFeatureFlag = keyof typeof featureFlags.development

/**
 * Utility functions for feature flag checking
 */
export const isFeatureEnabled = {
  auth: () => featureFlags.auth.enabled,
  analytics: () => featureFlags.analytics.enabled,
  beta: () => featureFlags.beta.enabled,
  debug: () => featureFlags.development.debugMode,
}

/**
 * Get all enabled features (useful for debugging)
 */
export const getEnabledFeatures = () => {
  const enabled: string[] = []
  
  Object.entries(featureFlags).forEach(([category, flags]) => {
    Object.entries(flags).forEach(([flag, value]) => {
      if (value === true) {
        enabled.push(`${category}.${flag}`)
      }
    })
  })
  
  return enabled
}

/**
 * Development helper - log all feature flags
 */
export const logFeatureFlags = () => {
  if (featureFlags.development.enableDevTools) {
    console.group('🚩 Task Master Feature Flags')
    console.table(featureFlags)
    console.log('Enabled features:', getEnabledFeatures())
    console.groupEnd()
  }
}
