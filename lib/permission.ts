// // lib/permissions.ts
// import { prisma } from "@/lib/prisma";

// export async function requirePermission(permissionName: string) {
//   const session = await getServerSession();

//   if (!session?.user?.id) {
//     throw new Error("Unauthorized");
//   }

//   const user = await prisma.user.findUnique({
//     where: { id: session.user.id },
//     include: {
//       role: {
//         include: {
//           permissions: {
//             include: { permission: true }
//           }
//         }
//       }
//     }
//   });

//   const hasPermission = user?.role?.permissions.some(
//     rp => rp.permission.name === permissionName
//   );

//   if (!hasPermission) {
//     throw new Error(`Forbidden: Missing permission ${permissionName}`);
//   }
// }
