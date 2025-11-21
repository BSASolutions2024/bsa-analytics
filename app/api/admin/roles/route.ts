import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const response = await prisma.role.findMany()
        return NextResponse.json({success: true, response})
    } catch (error:any) {
        console.error("Error in fetching:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}