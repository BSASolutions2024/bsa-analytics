import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const response = await prisma.user.findMany({
            include: {
                role: true
            }
        })

        return NextResponse.json({ success: true, response })
    } catch (error: any) {
        console.error("Error in fetching:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const { email, name, roleId, permissions } = await req.json()
    try {
        const response = await prisma.$transaction(async (tx) => {
            await tx.user.create({
                data: {
                    email,
                    name,
                    roleId
                }
            })
            if (permissions && permissions.length > 0) {
                const rolePermissionsData = permissions.map((permissionId: string) => ({
                    roleId,
                    permissionId,
                }));

                await prisma.rolePermission.createMany({
                    data: rolePermissionsData,
                    skipDuplicates: true, // prevent errors if permission already exists
                });
            }

        })

        return NextResponse.json({ success: true, response })
    } catch (error: any) {
        console.error("Error POST request:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}