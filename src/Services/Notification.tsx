import { notifications } from '@mantine/notifications'
import { IconCheck, IconX } from '@tabler/icons-react'
import React from 'react'

const SuccessNotification = (title:string, message:string) => {
    notifications.show({
        title: title,
        withCloseButton:true,
        icon:<IconCheck style={{width:"90%",height:"90%"}}/>,
        message: message,
        color:"teal",
        withBorder:true,
        className: "!border-green-500"
      })
}

const ErrorNotification = (title:string, message:string) => {
    notifications.show({
        title: title,
        withCloseButton:true,
        icon:<IconX style={{width:"90%",height:"90%"}}/>,
        message: message,
        color:"red",
        withBorder:true,
        className: "!border-red-500"
      })
}

export {SuccessNotification,ErrorNotification}
