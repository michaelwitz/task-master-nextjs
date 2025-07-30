/**
 * Utility functions for mapping between database column names and JavaScript properties
 */

/**
 * Converts snake_case to camelCase
 */
export function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

/**
 * Converts camelCase to snake_case
 */
export function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
}

/**
 * Maps database object to JavaScript object (snake_case to camelCase)
 */
export function mapDbToJs<T extends Record<string, unknown>>(dbObject: T): Record<string, unknown> {
  const jsObject: Record<string, unknown> = {}
  
  for (const [key, value] of Object.entries(dbObject)) {
    const camelKey = snakeToCamel(key)
    jsObject[camelKey] = value
  }
  
  return jsObject
}

/**
 * Maps JavaScript object to database object (camelCase to snake_case)
 */
export function mapJsToDb<T extends Record<string, unknown>>(jsObject: T): Record<string, unknown> {
  const dbObject: Record<string, unknown> = {}
  
  for (const [key, value] of Object.entries(jsObject)) {
    const snakeKey = camelToSnake(key)
    dbObject[snakeKey] = value
  }
  
  return dbObject
}

/**
 * Maps an array of database objects to JavaScript objects
 */
export function mapDbArrayToJs<T extends Record<string, unknown>>(dbArray: T[]): Record<string, unknown>[] {
  return dbArray.map(item => mapDbToJs(item))
}

/**
 * Maps an array of JavaScript objects to database objects
 */
export function mapJsArrayToDb<T extends Record<string, unknown>>(jsArray: T[]): Record<string, unknown>[] {
  return jsArray.map(item => mapJsToDb(item))
} 