-- CreateTable
CREATE TABLE "BankBalance" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "balance" INTEGER NOT NULL,

    CONSTRAINT "BankBalance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BankBalance_userId_key" ON "BankBalance"("userId");

-- AddForeignKey
ALTER TABLE "BankBalance" ADD CONSTRAINT "BankBalance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
