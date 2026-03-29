import { AppShell } from "@/components/layout/app-shell"
import { PageHeader } from "@/components/layout/page-header"
import { ClientRegionResources } from "./ClientRegionResources"
import { REGIONS } from "@/lib/constants"

export default function QuebecResourcesPage() {
  const region = REGIONS.find((r) => r.id === "quebec")!

  return (
    <AppShell showBackButton backHref="/learn/language">
      <ClientRegionResources region={region} />
    </AppShell>
  )
}
