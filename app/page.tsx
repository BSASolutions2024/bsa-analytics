"use client"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const analytics = [
    {
      title: "Offboarding",
      link: "/offboarding",
      description: "List of offboarded employees",
    },
  ];

  return (
    <div className="w-full flex flex-col min-h-screen">
      {/* Main content */}
      <main className="grow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
        <div className="flex flex-col gap-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-balance border-b pb-2">BSA Analytics</h1>
          {analytics.map((data, i) => (
            <Link key={i} href={data.link}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle>{data.title}</CardTitle>
                  <CardDescription>{data.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 text-center py-3 border-t text-sm text-gray-500">
        Powered by BPO
      </footer>
    </div>
  );
}
