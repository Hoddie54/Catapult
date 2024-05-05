import SideNav from "../../components/nav/side-nav"
import TopNav from "../../components/nav/top-nav"
import PlaceHolder from "../../components/placeholder/placeholder"
import MainForm from "../../components/forms/main-form/main-form"
import { useEffect } from "react"
import { useToast } from "../../../components/ui/use-toast"

export default function Homepage() {
  const { toast } = useToast()

  useEffect(() => {
    toast({
      title: "Warning",
      description:
        "Crypto-assets are risky investments that are volatile. You may lose all your investment.",
    })
  }, [])

  return (
    <div className="grid h-screen w-full pl-[56px]">
      <SideNav />
      <div className="flex flex-col">
        <TopNav />
        <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
          <MainForm />
          <PlaceHolder />
        </main>
      </div>
    </div>
  )
}
