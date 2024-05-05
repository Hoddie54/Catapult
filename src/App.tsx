import { TooltipProvider } from "@radix-ui/react-tooltip"
// import "./App.css"
import Homepage from "./pages/homepage/homepage"
import { Toaster } from "../components/ui/toaster"
import { BinanceDataContextProvider } from "./context/binance-data-context"
import { AlertDialogueContextProvider } from "./context/alert-dialogue-context"

function App() {
  return (
    <>
      {/* <div>Hey</div> */}
      <BinanceDataContextProvider>
        <AlertDialogueContextProvider>
          <TooltipProvider>
            <Toaster />
            <Homepage />
          </TooltipProvider>
        </AlertDialogueContextProvider>
      </BinanceDataContextProvider>
    </>
  )
}

export default App
