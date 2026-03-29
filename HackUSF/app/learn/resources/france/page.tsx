import { AppShell } from "@/components/layout/app-shell"
import { PageHeader } from "@/components/layout/page-header"
import { ClientRegionResources } from "./ClientRegionResources"
import { REGIONS } from "@/lib/constants"

export default function FranceResourcesPage() {
  const region = REGIONS.find((r) => r.id === "france")!

  return (
    <AppShell showBackButton backHref="/learn/language">
      <ClientRegionResources region={region} />
    </AppShell>
  )
}
