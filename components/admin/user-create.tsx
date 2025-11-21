"use client"
import * as z from "zod"
import { Controller, useForm, UseFormReturn } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet } from "../ui/field"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select"
import { Checkbox } from "../ui/checkbox"
import { useEffect, useState } from "react"


type UserCreateProps = {
    form: UseFormReturn<any>;
};

export default function UserCreate({ form }: UserCreateProps) {

    const [permissions, setPermissions] = useState<{ id: string; name: string }[]>([]);
    const [roles, setRoles] = useState<{ id: string; name: string }[]>([]);

    useEffect(() => {
        async function fetPermissions() {
            const res = await fetch("/api/admin/permissions")
            const result = await res.json()
            setPermissions(result?.response ?? [])
        }
        async function fetRoles() {
            const res = await fetch("/api/admin/roles")
            const result = await res.json()
            setRoles(result?.response ?? [])
        }
        fetPermissions()
        fetRoles()
    }, []);

    return (
        <>
            <FieldGroup>
                <FieldSet>
                    <Controller
                        name="name"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="name">
                                    Name
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id="name"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Name"
                                    autoComplete="off"
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                    <Controller
                        name="email"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="email">
                                    Email
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id="email"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Email"
                                    autoComplete="off"
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                    <Controller
                        name="roleId"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="role">
                                    Role
                                </FieldLabel>
                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    aria-invalid={fieldState.invalid}
                                >
                                    <SelectTrigger
                                        id="role"
                                        className={`${fieldState.invalid ? "border-destructive" : ""}`}>
                                        <SelectValue placeholder="Select a Role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Role Type</SelectLabel>
                                            {roles.map((role) => (
                                                <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                </FieldSet>
                <FieldSeparator />
                <FieldSet>
                    <FieldLegend>Permissions</FieldLegend>
                    <FieldDescription>
                        Grant user analytics view
                    </FieldDescription>
                    <FieldGroup>
                        <Controller
                            name="permissions"
                            control={form.control}
                            defaultValue={[]} // must be an array for checkboxes
                            render={({ field, fieldState }) => (
                                <FieldGroup>
                                    {permissions.map((permission) => (
                                        <Field key={permission.id} orientation="horizontal">
                                            <Checkbox
                                                id={`permission-${permission.id}`}
                                                checked={field.value.includes(permission.id)}
                                                onCheckedChange={(checked) => {
                                                    if (checked) {
                                                        field.onChange([...field.value, permission.id]);
                                                    } else {
                                                        field.onChange(field.value.filter((v: string) => v !== permission.id));
                                                    }
                                                }}
                                            />
                                            <FieldLabel
                                                htmlFor={`permission-${permission.id}`}
                                                className="font-normal"
                                            >
                                                {permission.name}
                                            </FieldLabel>
                                        </Field>
                                    ))}
                                    {fieldState.invalid && (
                                        <p className="text-destructive text-sm">{fieldState.error?.message}</p>
                                    )}
                                </FieldGroup>
                            )}
                        />
                    </FieldGroup>
                </FieldSet>
            </FieldGroup>
        </>
    )
}