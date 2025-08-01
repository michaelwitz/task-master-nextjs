"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { User } from "@/types"

interface UserSearchProps {
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  label?: string
}

export function UserSearch({ value, onValueChange, placeholder = "Search users...", label }: UserSearchProps) {
  const [open, setOpen] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const triggerButtonRef = useRef<HTMLButtonElement>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  // Load users on mount
  useEffect(() => {
    loadUsers()
  }, [])

  // Scroll focused item into view
  useEffect(() => {
    if (focusedIndex >= 0 && itemRefs.current[focusedIndex] && listRef.current) {
      const focusedItem = itemRefs.current[focusedIndex]
      const container = listRef.current
      
      if (focusedItem) {
        const itemTop = focusedItem.offsetTop
        const itemBottom = itemTop + focusedItem.offsetHeight
        const containerTop = container.scrollTop
        const containerBottom = containerTop + container.clientHeight
        
        if (itemTop < containerTop) {
          // Item is above visible area, scroll up
          container.scrollTop = itemTop
        } else if (itemBottom > containerBottom) {
          // Item is below visible area, scroll down
          container.scrollTop = itemBottom - container.clientHeight
        }
      }
    }
  }, [focusedIndex])

  const loadUsers = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setLoading(false)
    }
  }

  const selectedUser = users.find(user => user.id.toString() === value)

  // Filter users based on search query
  const filteredUsers = searchQuery.trim() === "" 
    ? users 
    : users.filter(user => 
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      )

  // Reset item refs when filtered users change
  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, filteredUsers.length)
  }, [filteredUsers.length])

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      setSearchQuery("")
      setFocusedIndex(-1)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        e.preventDefault()
        setOpen(false)
        break
      case 'ArrowDown':
        e.preventDefault()
        setFocusedIndex(prev => Math.min(prev + 1, filteredUsers.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setFocusedIndex(prev => Math.max(prev - 1, -1))
        break
      case 'Enter':
        e.preventDefault()
        if (focusedIndex >= 0 && focusedIndex < filteredUsers.length) {
          selectUser(filteredUsers[focusedIndex])
        } else if (filteredUsers.length === 1) {
          selectUser(filteredUsers[0])
        }
        break
      case ' ':
        e.preventDefault()
        if (focusedIndex >= 0 && focusedIndex < filteredUsers.length) {
          selectUser(filteredUsers[focusedIndex])
        }
        break
    }
  }

  const selectUser = (user: User) => {
    onValueChange(user.id.toString())
    setOpen(false)
    setSearchQuery("")
    setFocusedIndex(-1)
    // Return focus to the trigger button so tab navigation can continue
    setTimeout(() => {
      if (triggerButtonRef.current) {
        triggerButtonRef.current.focus()
      }
    }, 0)
  }

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setOpen(!open)
  }

  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      e.stopPropagation()
      setOpen(!open)
    } else if (e.key === 'Tab') {
      // Let tab navigation work normally - don't open popover on tab
      // The popover will only open on Enter/Space or click
    }
  }

  const handleTriggerFocus = (e: React.FocusEvent) => {
    // Don't auto-open on focus - only open on Enter/Space or click
    // This allows normal tab navigation to work
  }

  return (
    <div className="space-y-2" data-user-search>
      {label && <Label>{label}</Label>}
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            ref={triggerButtonRef}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            tabIndex={0}
            onClick={handleTriggerClick}
            onKeyDown={handleTriggerKeyDown}
            onFocus={handleTriggerFocus}
          >
            {selectedUser ? selectedUser.fullName : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-[var(--radix-popover-trigger-width)] p-0" 
          align="start" 
          side="bottom"
          sideOffset={4}
          style={{
            position: 'fixed',
            zIndex: 9999
          }}
          onOpenAutoFocus={(e) => {
            setTimeout(() => {
              if (searchInputRef.current) {
                searchInputRef.current.focus()
              }
            }, 0)
          }}
        >
          <div className="p-2">
            <Input
              ref={searchInputRef}
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-2"
              tabIndex={open ? 0 : -1}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={handleKeyDown}
            />
            <div 
              ref={listRef}
              className="max-h-[200px] overflow-y-auto"
              onKeyDown={handleKeyDown}
            >
              {loading ? (
                <div className="p-2 text-sm text-muted-foreground">Loading...</div>
              ) : filteredUsers.length === 0 ? (
                <div className="p-2 text-sm text-muted-foreground">No users found.</div>
              ) : (
                filteredUsers.map((user, index) => (
                  <div
                    key={user.id}
                    ref={(el) => {
                      itemRefs.current[index] = el
                    }}
                    className={cn(
                      "flex items-center p-2 hover:bg-accent hover:text-accent-foreground cursor-pointer rounded-sm",
                      index === focusedIndex && "bg-accent text-accent-foreground"
                    )}
                    tabIndex={open ? 0 : -1}
                    role="option"
                    aria-selected={value === user.id.toString()}
                    onClick={(e) => {
                      e.stopPropagation()
                      selectUser(user)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        e.stopPropagation()
                        selectUser(user)
                      }
                    }}
                    onMouseEnter={() => setFocusedIndex(index)}
                  >
                    {value === user.id.toString() ? (
                      <Check className="mr-2 h-4 w-4 opacity-100" />
                    ) : (
                      <div className="mr-2 h-4 w-4" />
                    )}
                    <div className="flex flex-col">
                      <span>{user.fullName}</span>
                      <span className="text-sm text-muted-foreground">{user.email}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
} 