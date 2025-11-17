import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Create permissions
  const manageUsers = await prisma.permission.upsert({
    where: { name: "manage_users" },
    update: {},
    create: { name: "manage_users" }
  });

  const assignRole = await prisma.permission.upsert({
    where: { name: "assign_role" },
    update: {},
    create: { name: "assign_role" }
  });

  const viewReports = await prisma.permission.upsert({
    where: { name: "view_reports" },
    update: {},
    create: { name: "view_reports" }
  });

  // Create roles
  const admin = await prisma.role.upsert({
    where: { name: "admin" },
    update: {},
    create: { name: "admin" }
  });

  const employee = await prisma.role.upsert({
    where: { name: "employee" },
    update: {},
    create: { name: "employee" }
  });

  // RolePermissions
  await prisma.rolePermission.createMany({
    data: [
      { roleId: admin.id, permissionId: manageUsers.id },
      { roleId: admin.id, permissionId: assignRole.id },
      { roleId: admin.id, permissionId: viewReports.id },

      { roleId: employee.id, permissionId: viewReports.id },
    ],
    skipDuplicates: true,
  });

  console.log("RBAC seed completed.");
}

main().finally(() => prisma.$disconnect());
