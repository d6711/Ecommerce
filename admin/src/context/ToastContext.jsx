import React, { createContext, useContext } from 'react'
import { message, notification } from 'antd'

const ToastContext = createContext(null)

export const ToastProvider = ({ children }) => {
    const [messageApi, contextHolderMsg] = message.useMessage()
    const [notificationApi, contextHolderNoti] = notification.useNotification()

    const toast = {
        success: (content, duration = 3) =>
            messageApi.success(content, duration),

        error: (content, duration = 3) => messageApi.error(content, duration),

        info: (content, duration = 3) => messageApi.info(content, duration),

        warning: (content, duration = 3) =>
            messageApi.warning(content, duration),

        notify: ({ type = 'info', message: msg, description }) =>
            notificationApi[type]({
                message: msg,
                description,
            }),
    }

    return (
        <ToastContext.Provider value={toast}>
            {contextHolderMsg}
            {contextHolderNoti}
            {children}
        </ToastContext.Provider>
    )
}

export const useToast = () => useContext(ToastContext)
