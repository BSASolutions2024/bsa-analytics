"use client"

import { useEffect, useState } from "react";
import { StandardDataTable } from "../data-table/data-table-standard"
import { User, userColumns } from "@/app/(dashboard)/admin/user-management/columns";
import { Button } from "../ui/button";
import UserCreate from "./user-create";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const userCreateSchema = z.object({
    name: z.string().min(1, "User name is required"),
    email: z.string().nonempty("Email is required").email("Invalid email address"),
    roleId: z.string().nonempty("Role is required"),
    permissions: z.array(z.string()).min(1, "At least one permission must be selected")
})

export default function UserManagementDashboard() {
    const [data, setData] = useState([]);
    const [fetchedAt, setFetchedAt] = useState<String>()
    const [isLoading, setIsLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [filteredData, setFilteredData] = useState<User[]>([])
    const [open, setOpen] = useState(false);

    const form = useForm<z.infer<typeof userCreateSchema>>({
        resolver: zodResolver(userCreateSchema),
        defaultValues: {
            name: "",
            email: "",
            roleId: "",
            permissions: []
        }
    })

    const onSubmit = async (data: z.infer<typeof userCreateSchema>) => {
        try {
            const res = await fetch(`/api/admin/user`, {
                method: "POST",
                body: JSON.stringify(data)
            })

            if (res.ok) {
                fetchData()
                setOpen(false)
                form.reset()
                toast.success("Successfully added")
            }

        } catch (err) {
            console.error("Error fetching offboarding data:", err);
            toast.error("Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    const fetchData = async () => {
        try {
            const res = await fetch(`/api/admin/user`, {
                cache: "no-store",
            });
            const result = await res.json();
            if (res.ok) {
                setData(result.response ?? []);
            }

        } catch (err) {
            console.error("Error fetching offboarding data:", err);
        } finally {
            setIsLoading(false)
        }
    }
    useEffect(() => {
        fetchData();
    }, [])

    const onFilterData = (filter: any) => {
        setFilteredData(filter)
    }


    return (
        <div className="flex flex-col gap-4">
            <Dialog open={open} onOpenChange={(isOpen) => {
                setOpen(isOpen);
                if (!isOpen) form.reset(); 
            }}>
                <DialogTrigger asChild><Button className="w-auto self-start" >Add User</Button></DialogTrigger>
                <DialogContent>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <DialogHeader>
                            <DialogTitle>Whitelist a user</DialogTitle>
                            <DialogDescription>
                                This is to whitelist user and grant access to analytics
                            </DialogDescription>
                        </DialogHeader>
                        <UserCreate form={form} />
                        <DialogFooter>
                            <Button type="submit">Confirm</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
            <StandardDataTable data={data} columns={userColumns} isLoading={isLoading} onFilteredDataChange={onFilterData} />
        </div>
    )
}