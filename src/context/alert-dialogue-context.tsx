import * as React from "react"
import { createContext, ReactNode, useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPortal,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog"

interface AlertDialogueContextType {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  title: React.ReactNode
  setTitle: React.Dispatch<React.SetStateAction<React.ReactNode>>
  description: React.ReactNode
  setDescription: React.Dispatch<React.SetStateAction<React.ReactNode>>
  action: () => void
  setAction: React.Dispatch<React.SetStateAction<() => void>>
}

export const AlertDialogueContext = createContext<AlertDialogueContextType>({
  open: false,
  setOpen: () => {},
  title: <></>,
  setTitle: () => {},
  description: <></>,
  setDescription: () => {},
  action: () => {},
  setAction: () => {},
})

type ContextProviderProps = {
  children?: ReactNode
}

export const AlertDialogueContextProvider = ({
  children,
}: ContextProviderProps) => {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState<ReactNode>(<></>)
  const [description, setDescription] = useState<ReactNode>(<></>)
  const [action, setAction] = useState<() => void>(() => {})

  const [data] = useState<AlertDialogueContextType>({
    open,
    setOpen,
    title,
    setTitle,
    description,
    setDescription,
    action,
    setAction,
  })

  function close() {
    setOpen(false)
  }

  return (
    <AlertDialogueContext.Provider value={{ ...data }}>
      <AlertDialog open={open}>
        {children}
        <AlertDialogPortal>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{title}</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription>{description}</AlertDialogDescription>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={close}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  action()
                  close()
                }}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogPortal>
      </AlertDialog>
    </AlertDialogueContext.Provider>
  )
}
