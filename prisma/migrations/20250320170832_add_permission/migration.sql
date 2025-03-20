-- AlterTable
ALTER TABLE "shop_infos" ADD COLUMN     "slogan" TEXT;

-- CreateTable
CREATE TABLE "permissions" (
    "permission_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "api" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "moduleId" INTEGER NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("permission_id")
);

-- CreateTable
CREATE TABLE "modules" (
    "module_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "modules_pkey" PRIMARY KEY ("module_id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "role_permission_id" SERIAL NOT NULL,
    "role_id" INTEGER NOT NULL,
    "permission_id" INTEGER NOT NULL,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("role_permission_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "permissions_api_method_key" ON "permissions"("api", "method");

-- CreateIndex
CREATE UNIQUE INDEX "modules_name_key" ON "modules"("name");

-- CreateIndex
CREATE UNIQUE INDEX "role_permissions_role_id_permission_id_key" ON "role_permissions"("role_id", "permission_id");

-- AddForeignKey
ALTER TABLE "permissions" ADD CONSTRAINT "permissions_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "modules"("module_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("role_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("permission_id") ON DELETE CASCADE ON UPDATE CASCADE;
