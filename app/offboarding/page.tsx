import { columns, Offboarding } from "./columns";
import { OffboardingDataTable } from "./data-table";

export default function Page() {
    const data:Offboarding[] = []
    return (
        <OffboardingDataTable columns={columns} data={data} />
    )
}