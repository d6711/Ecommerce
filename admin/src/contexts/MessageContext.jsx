import { message } from 'antd'
import { createContext, useContext } from 'react'

export const MessageContext = createContext()

export const MessageProvider = ({ children }) => {
  const [messageApi, contextHolder] = message.useMessage()
  const showMessage = {
    success: (msg, duration = 2) => messageApi.success(msg, duration),
    error: (msg, duration = 3) => messageApi.error(msg, duration),
    loading: (msg, duration = 0) => messageApi.loading(msg, duration),
    open: messageApi.open,
    destroy: messageApi.destroy,
  }
  return (
    <MessageContext.Provider value={showMessage}>
      {contextHolder}
      {children}
    </MessageContext.Provider>
  )
}

export const useMessageContext = () => useContext(MessageContext)
