"use client"

import { notFound, usePathname } from "next/navigation";
import { Separator } from "./ui/separator";
import { SidebarInset, SidebarTrigger } from "./ui/sidebar";
import Link from "next/link";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "./ui/breadcrumb";
import { useSession } from "next-auth/react";
import { User } from "next-auth";

export default function SidebarWrapper({ children }: { children: React.ReactNode; }) {
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean)

    const { data: session } = useSession()
    const user = session?.user as User

    if (pathname === "/") return <>{children}</>

    return (
        <SidebarInset className="flex-1 overflow-x-hidden overflow-y-auto">
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator
                    orientation="vertical"
                    className="mr-2 data-[orientation=vertical]:h-4"
                />
                <Breadcrumb>
                    <BreadcrumbList>
                        {segments.map((segment, index) => {
                            const href = "/" + segments.slice(0, index + 1).join("/");
                            const name =
                                segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
                            const isLast = index === segments.length - 1;
                            return (

                                <div key={href} className="flex items-center">
                                    {!isLast && (
                                        <BreadcrumbSeparator />
                                    )}

                                    <BreadcrumbItem>
                                        {isLast ? (
                                            <BreadcrumbPage>{name}</BreadcrumbPage>
                                        ) : (
                                            <BreadcrumbLink asChild>
                                                <Link href={href}>{name}</Link>
                                            </BreadcrumbLink>
                                        )}
                                    </BreadcrumbItem>
                                </div>
                            );
                        })}
                    </BreadcrumbList>
                </Breadcrumb>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4">
                {children}
            </div>
        </SidebarInset>
    )
}