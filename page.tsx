'use client'

import { useState } from 'react'
import { Moon, Sun, Upload, Send, Loader2 } from 'lucide-react'

export default function Page() {
  const [isDark, setIsDark] = useState(false)
  const [query, setQuery] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle('dark')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('query', query)
      if (file) {
        formData.append('file', file)
      }
      const res = await fetch('/api/gpt', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      setResponse(data.response || 'No response received')
    } catch {
      setResponse('Error: Failed to get response')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
      <div className="bg-white dark:bg-black min-h-screen px-6 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-black dark:text-white">TDLcodex</h1>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
          >
            {isDark ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>

        {/* Query Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-300">Your Query</label>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask me something about TDL..."
              className="w-full p-3 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
              rows={4}
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-300">Upload File (Optional)</label>
            <div
              className={`p-6 border-2 border-dashed rounded ${
                dragActive ? 'border-blue-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              onDragEnter={(e) => {
                e.preventDefault()
                setDragActive(true)
              }}
              onDragLeave={(e) => {
                e.preventDefault()
                setDragActive(false)
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                setDragActive(false)
                if (e.dataTransfer.files[0]) {
                  setFile(e.dataTransfer.files[0])
                }
              }}
            >
              <input
                type="file"
                className="hidden"
                id="file-upload"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setFile(e.target.files[0])
                  }
                }}
              />
              <label htmlFor="file-upload" className="cursor-pointer flex items-center space-x-2">
                <Upload size={20} />
                <span className="text-sm">
                  {file ? file.name : 'Click or drag a file to upload'}
                </span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Processing...
              </>
            ) : (
              <>
                <Send size={16} /> Submit Query
              </>
            )}
          </button>
        </form>

        {/* Response */}
        {response && (
          <div className="mt-8 bg-gray-100 dark:bg-gray-800 p-6 rounded text-gray-800 dark:text-gray-100 whitespace-pre-wrap">
            {response}
          </div>
        )}
      </div>
    </div>
  )
}
