/*
  Warnings:

  - A unique constraint covering the columns `[bus_number]` on the table `Bus` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Bus_bus_number_key` ON `Bus`(`bus_number`);
