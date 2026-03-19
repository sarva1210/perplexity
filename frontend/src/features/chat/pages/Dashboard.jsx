import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useSelector } from 'react-redux'
import { useChat } from '../hooks/useChat'

const Dashboard = () => {
  const chat = useChat()
  const [ chatInput, setChatInput ] = useState('')
  const chats = useSelector((state) => state.chat.chats)
  const currentChatId = useSelector((state) => state.chat.currentChatId)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  useEffect(() => {
    chat.initializeSocketConnection()
    chat.handleGetChats()
  }, [])

  const handleSubmitMessage = (event) => {
    event.preventDefault()

    const trimmedMessage = chatInput.trim()
    if (!trimmedMessage) {
      return
    }

    chat.handleSendMessage({ message: trimmedMessage, chatId: currentChatId })
    setChatInput('')
  }

  const openChat = (chatId) => {
    chat.handleOpenChat(chatId)
  }

  return (
    <main className="h-screen overflow-hidden bg-gradient-to-br from-[#05070d] via-[#0b1020] to-[#05070d] text-white flex">

      <aside className={`${isSidebarOpen ? 'w-64' : 'w-16'} h-full transition-all duration-300 p-4 hidden md:flex flex-col 
        bg-white/5 backdrop-blur-xl border-r border-white/10 relative`}>

        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className=" absolute right-3 top-6 bg-white/10 border border-white/20 
            rounded-full w-7 h-7 flex items-center justify-center text-xs hover:bg-white/20"
        >
          {isSidebarOpen ? '<' : '>'}
        </button>

        <h1 className={`text-3xl font-semibold ml-2 mb-6 ${!isSidebarOpen && 'hidden'}`}>
          Perplexity
        </h1>

        <div className={`space-y-2 overflow-y-auto pr-1 ${!isSidebarOpen && 'items-center'}`}>
          {Object.values(chats).map((chatItem, index) => (
            <button
              key={index}
              onClick={() => openChat(chatItem.id)}
              className={`w-full px-3 py-2 rounded-lg transition-all text-sm text-left
                ${currentChatId === chatItem.id
                  ? 'bg-white/20 border border-white/20'
                  : 'hover:bg-white/10'
                }`}
            >
              <p className={`${!isSidebarOpen && 'hidden'} truncate text-white/90`}>
                {chatItem.title}
              </p>
            </button>
          ))}
        </div>

        <div className={`mt-auto text-xs text-white/40 pt-4 ${!isSidebarOpen && 'hidden'}`}>
          © 2026
        </div>

      </aside>

      <section className="flex-1 flex flex-col items-center p-6 relative h-full overflow-hidden">

        <div className="w-full max-w-3xl flex flex-col h-full">

          {!currentChatId && (
            <div className="flex flex-col items-center justify-center text-center space-y-4 flex-1">

              <h2 className="text-3xl font-semibold">Welcome to Perplexity</h2>
              <p className="text-white/50">Ask anything and get intelligent answers instantly.</p>
              <p className="text-white/40 mt-4">Start a new conversation from below</p>
              
            </div>
          )}

          <div className="flex-1 overflow-y-auto scroll-smooth no-scrollbar space-y-4 pb-32 pr-1">
            {chats[currentChatId]?.messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm shadow-md
                  ${message.role === 'user'
                    ? 'ml-auto bg-white/10 border border-white/20 text-white rounded-2xl rounded-br-none'
                    : 'mr-auto bg-white/5 border border-white/10 text-white/90 rounded-2xl rounded-bl-none'
                  }`}
              >
                {message.role === 'user' ? (
                  <p>{message.content}</p>
                ) : (
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                      code: ({ children }) => (
                        <code className="bg-black/40 px-1 py-0.5 rounded">
                          {children}
                        </code>
                      ),
                      pre: ({ children }) => (
                        <pre className="bg-black/50 p-3 rounded-xl overflow-x-auto mb-2">
                          {children}
                        </pre>
                      )
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                )}
              </div>
            ))}
          </div>

          <footer className="absolute bottom-4 left-0 w-full flex justify-center px-4">
            <form 
            onSubmit={handleSubmitMessage}
            className="w-full max-w-3xl rounded-2xl p-[1px] bg-gradient-to-r from-red-500 via-pink-500 to-purple-500">

              <div className="flex items-center gap-3 bg-[#0b0f1a] rounded-2xl px-4 py-3">
                
                <input
                type="text"
                value={chatInput}
                onChange={(event) => setChatInput(event.target.value)}
                placeholder="Ask anything..."
                className="flex-1 bg-transparent outline-none text-white placeholder:text-white/40"
                />
                
                <button 
                type="submit"
                disabled={!chatInput.trim()}
                className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition disabled:opacity-40">
                 Send
                </button>
              </div>
            </form>
          </footer>

        </div>
      </section>
    </main>
  )
}

export default Dashboard