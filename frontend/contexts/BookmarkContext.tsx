import React, { createContext, useContext, useState, ReactNode } from 'react'

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
  const [bookmarkedItems, setBookmarkedItems] = useState<string[]>([])

  const addBookmark = (itemId: string) => {
    console.log('BookmarkContext: Adding bookmark for ID:', itemId)
    setBookmarkedItems(prev => {
      const newItems = [...prev, itemId]
      console.log('BookmarkContext: Updated bookmarkedItems:', newItems)
      return newItems
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