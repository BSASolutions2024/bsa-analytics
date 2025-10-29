import { columns, Offboarding } from "./columns";
import { OffboardingDataTable } from "./data-table";

export default async function Page() {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/offboarding/get-data`, {
        cache: "no-store",
    });
    const result = await res.json();
    const data: Offboarding[] = result?.response ?? []
    return (
        <OffboardingDataTable columns={columns} data={data} />
    )
}