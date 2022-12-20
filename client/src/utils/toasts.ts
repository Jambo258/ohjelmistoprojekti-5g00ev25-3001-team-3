import { toast } from 'react-toastify'

export const successToast = (text: string) =>
  toast.success(text, {
    position: 'top-right',
    autoClose: 3000,
    closeOnClick: true,
    draggable: true,
    progress: undefined,
    theme: 'colored',
    pauseOnFocusLoss: false
  })

export const failureToast = (text: string) =>
  toast.error(text, {
    position: 'top-right',
    autoClose: 3000,
    closeOnClick: true,
    draggable: true,
    progress: undefined,
    theme: 'colored',
    pauseOnFocusLoss: false
  })
