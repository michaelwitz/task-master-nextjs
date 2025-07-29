/**
 * Example: How to use Feature Flags in Components
 * 
 * This file demonstrates various ways to use the feature flag system
 * in your React components and API routes.
 */

import { featureFlags, isFeatureEnabled, logFeatureFlags } from '@/lib/config/feature-flags'
import { useEffect } from 'react'

export function FeatureFlagExamples() {
  // Log feature flags in development
  useEffect(() => {
    logFeatureFlags()
  }, [])

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">Feature Flag Examples</h2>
      
      {/* Example 1: Simple conditional rendering */}
      {featureFlags.auth.enabled && (
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold">🔐 Authentication Enabled</h3>
          <p>User authentication features are active.</p>
          
          {featureFlags.auth.requireEmailVerification && (
            <p className="text-sm text-gray-600 mt-2">
              ✉️ Email verification is required for new users.
            </p>
          )}
        </div>
      )}

      {/* Example 2: Using utility functions */}
      {isFeatureEnabled.analytics() && (
        <div className="p-4 bg-green-50 rounded-lg">
          <h3 className="font-semibold">📊 Analytics Active</h3>
          <p>User analytics and tracking are enabled.</p>
        </div>
      )}

      {/* Example 3: Beta features */}
      {featureFlags.beta.enabled && (
        <div className="p-4 bg-purple-50 rounded-lg">
          <h3 className="font-semibold">🧪 Beta Features</h3>
          <ul className="list-disc list-inside mt-2 space-y-1">
            {featureFlags.beta.advancedKanban && (
              <li>Advanced Kanban features available</li>
            )}
            {featureFlags.beta.aiSuggestions && (
              <li>AI-powered suggestions enabled</li>
            )}
          </ul>
        </div>
      )}

      {/* Example 4: Development features */}
      {featureFlags.development.enableDevTools && (
        <div className="p-4 bg-yellow-50 rounded-lg">
          <h3 className="font-semibold">🛠️ Development Mode</h3>
          <p>Development tools and debugging features are active.</p>
          
          {featureFlags.development.showPerformanceMetrics && (
            <p className="text-sm text-gray-600 mt-2">
              ⚡ Performance metrics are being tracked.
            </p>
          )}
        </div>
      )}

      {/* Example 5: Fallback when features are disabled */}
      {!featureFlags.auth.enabled && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold">👥 Guest Mode</h3>
          <p>Running in guest mode - no authentication required.</p>
        </div>
      )}
    </div>
  )
}

/**
 * Example: Server-side usage in API routes
 */
export function apiRouteExample() {
  // Example API route logic
  /*
  // pages/api/example.ts or app/api/example/route.ts
  
  import { featureFlags } from '@/lib/config/feature-flags'
  
  export async function GET(request: Request) {
    // Check if auth is required
    if (featureFlags.auth.enabled) {
      // Validate user session/token
      const session = await getSession(request)
      if (!session) {
        return new Response('Unauthorized', { status: 401 })
      }
    }
    
    // Your API logic here
    const data = await fetchData()
    
    // Add analytics if enabled
    if (featureFlags.analytics.enabled && featureFlags.analytics.trackUserActions) {
      await trackEvent('api_call', { endpoint: '/api/example' })
    }
    
    return Response.json(data)
  }
  */
}

/**
 * Example: Custom hook for feature flags
 */
export function useFeatureFlags() {
  return {
    isAuthEnabled: featureFlags.auth.enabled,
    isAnalyticsEnabled: featureFlags.analytics.enabled,
    isBetaEnabled: featureFlags.beta.enabled,
    isDebugMode: featureFlags.development.debugMode,
    
    // Compound checks
    shouldShowAuthButtons: featureFlags.auth.enabled && !featureFlags.auth.allowGuestAccess,
    shouldTrackAnalytics: featureFlags.analytics.enabled && featureFlags.analytics.trackUserActions,
  }
}
