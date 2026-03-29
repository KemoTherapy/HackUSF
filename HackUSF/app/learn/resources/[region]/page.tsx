import { AppShell } from "@/components/layout/app-shell"
import { PageHeader } from "@/components/layout/page-header"
import { REGIONS } from "@/lib/constants"
import { ClientRegionResources } from "./ClientRegionResources"

interface Props {
  params: {
    region: string
  }
}

export default function RegionResourcesPage({ params }: Props) {
  const regionId = params.region
  const region = REGIONS.find((r) => r.id === regionId)

  if (!region) {
    return (
      <AppShell showBackButton backHref="/learn/language">
        <div className="max-w-[1200px] mx-auto px-6 py-8 md:px-12 pb-32">
          <PageHeader title="Resources" subtitle="Unknown region" />
          <p className="text-muted">No resources found for this region.</p>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell showBackButton backHref="/learn/language?next=resources">
      <ClientRegionResources region={region} />
    </AppShell>
  )
}

