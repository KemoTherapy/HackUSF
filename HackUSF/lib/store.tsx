"use client"

import { createContext, useCallback, useContext, useState, useEffect, type ReactNode } from "react"
import type { GuestSession, Language, Region, CefrLevel, Scenario, PracticeSession } from "./types"
import { createInitialGuestSession } from "./constants"

const STORAGE_KEY = "lingua_guest_session"

interface StoreContextType {
  session: GuestSession
  setResourcesFlow: (enabled: boolean) => void
  setLanguageAndRegion: (language: Language, region: Region) => void
  setCurrentLevel: (level: CefrLevel) => void
  addPracticeSession: (practiceSession: PracticeSession) => void
  updateLevelProgress: (level: CefrLevel, starsEarned: number, scenario?: Scenario) => void
  resetSession: () => void
  isHydrated: boolean
}

const StoreContext = createContext<StoreContextType | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<GuestSession>(createInitialGuestSession)
  const [isHydrated, setIsHydrated] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as GuestSession
        setSession(parsed)
      } catch {
        // Invalid data, use default
      }
    }
    setIsHydrated(true)
  }, [])

  // Save to localStorage on changes
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
    }
  }, [session, isHydrated])

  const setResourcesFlow = useCallback((enabled: boolean) => {
    setSession((prev) => ({ ...prev, resourcesFlow: enabled }))
  }, [])

  const setLanguageAndRegion = useCallback((language: Language, region: Region) => {
    setSession((prev) => ({ ...prev, language, region }))
  }, [])

  const setCurrentLevel = useCallback((level: CefrLevel) => {
    setSession((prev) => ({ ...prev, currentLevel: level }))
  }, [])

  const addPracticeSession = useCallback((practiceSession: PracticeSession) => {
    setSession((prev) => ({
      ...prev,
      sessions: [...prev.sessions, practiceSession],
    }))
  }, [])

  const updateLevelProgress = useCallback((level: CefrLevel, starsEarned: number, scenario?: Scenario) => {
    setSession((prev) => {
      const currentProgress = prev.levelProgress[level]
      const newScenariosCompleted = scenario && !currentProgress.scenariosCompleted.includes(scenario)
        ? [...currentProgress.scenariosCompleted, scenario]
        : currentProgress.scenariosCompleted

      return {
        ...prev,
        levelProgress: {
          ...prev.levelProgress,
          [level]: {
            starsEarned: Math.max(currentProgress.starsEarned, starsEarned),
            completed: newScenariosCompleted.length >= 4 && starsEarned >= 4,
            scenariosCompleted: newScenariosCompleted,
            bestScore: Math.max(currentProgress.bestScore, starsEarned * 20),
          },
        },
      }
    })
  }, [])

  const resetSession = useCallback(() => {
    const newSession = createInitialGuestSession()
    setSession(newSession)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSession))
  }, [])

  return (
    <StoreContext.Provider
      value={{
        session,
        setResourcesFlow,
        setLanguageAndRegion,
        setCurrentLevel,
        addPracticeSession,
        updateLevelProgress,
        resetSession,
        isHydrated,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider")
  }
  return context
}
