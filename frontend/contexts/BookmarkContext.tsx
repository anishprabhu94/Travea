import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface BookmarkContextType {
  bookmarkedItems: string[]
  addBookmark: (itemId: string) => void
  removeBookmark: (itemId: string) => void
  isBookmarked: (itemId: string) => boolean
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined)

export const useBookmarks = () => {
  const context = useContext(BookmarkContext)
  if (!context) {
    throw new Error('useBookmarks must be used within a BookmarkProvider')
  }
  return context
}

interface BookmarkProviderProps {
  children: ReactNode
}

export const BookmarkProvider: React.FC<BookmarkProviderProps> = ({ children }) => {
  // TESTING: Start with some hardcoded bookmarks to test if context works
  const [bookmarkedItems, setBookmarkedItems] = useState<string[]>(['amalfi', 'kyoto'])

  console.log('BookmarkProvider: Rendering with bookmarkedItems:', bookmarkedItems)

  // Load bookmarks from storage on mount
  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        const stored = await AsyncStorage.getItem('@travea_bookmarks')
        if (stored) {
          const parsed = JSON.parse(stored)
          console.log('BookmarkContext: Loaded from storage:', parsed)
          setBookmarkedItems(parsed)
        } else {
          // If no stored data, keep the test data
          console.log('BookmarkContext: No stored data, using test bookmarks')
        }
      } catch (error) {
        console.log('BookmarkContext: Error loading bookmarks:', error)
      }
    }
    loadBookmarks()
  }, [])

  // Save to storage whenever bookmarks change
  useEffect(() => {
    const saveBookmarks = async () => {
      try {
        await AsyncStorage.setItem('@travea_bookmarks', JSON.stringify(bookmarkedItems))
        console.log('BookmarkContext: Saved to storage:', bookmarkedItems)
      } catch (error) {
        console.log('BookmarkContext: Error saving bookmarks:', error)
      }
    }
    if (bookmarkedItems.length > 0) {
      saveBookmarks()
    }
  }, [bookmarkedItems])

  const addBookmark = (itemId: string) => {
    console.log('BookmarkContext: Adding bookmark for ID:', itemId)
    setBookmarkedItems(prev => {
      if (!prev.includes(itemId)) {
        const newItems = [...prev, itemId]
        console.log('BookmarkContext: Updated bookmarkedItems:', newItems)
        return newItems
      }
      return prev
    })
  }

  const removeBookmark = (itemId: string) => {
    console.log('BookmarkContext: Removing bookmark for ID:', itemId)
    setBookmarkedItems(prev => {
      const newItems = prev.filter(id => id !== itemId)
      console.log('BookmarkContext: Updated bookmarkedItems:', newItems)
      return newItems
    })
  }

  const isBookmarked = (itemId: string) => {
    return bookmarkedItems.includes(itemId)
  }

  return (
    <BookmarkContext.Provider value={{
      bookmarkedItems,
      addBookmark,
      removeBookmark,
      isBookmarked
    }}>
      {children}
    </BookmarkContext.Provider>
  )
}