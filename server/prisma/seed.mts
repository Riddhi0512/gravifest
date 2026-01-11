import { PrismaClient } from "@prisma/client";
import * as url from 'url';        // Use * as url
import path, { join } from 'path'; // Use default import for 'path'
import * as fs from "fs";          // Use * as fs

const prisma = new PrismaClient();

async function deleteAllData(orderedFileNames: string[]) {
  // Get model names from file names (e.g., "users.json" -> "users")
  const modelNames = orderedFileNames.map((fileName) =>
    path.basename(fileName, path.extname(fileName))
  );

  // Reverse the array to delete from child tables before parent tables
  for (const modelName of modelNames.reverse()) {
    const model: any = prisma[modelName as keyof typeof prisma];
    if (model) {
      await model.deleteMany({});
      console.log(`✅ Cleared data from ${modelName}`);
    } else {
      console.error(
        `Model ${modelName} not found. Ensure file name matches Prisma model name.`
      );
    }
  }
}

async function main() {
    // 1. Get the URL of the current file
    const currentFileUrl = new URL(import.meta.url);
    
    // 2. Convert the URL to a file path using url.fileURLToPath
    const currentFilePath = url.fileURLToPath(currentFileUrl);
    
    // 3. Get the directory name using path.join
    // path.dirname is a built-in method that is often safer than joining '..'
    const currentDirname = path.dirname(currentFilePath); 

    // 4. Define the path to the seed data folder
    const dataDirectory = path.join(currentDirname, "seedData");

  const orderedFileNames = [
    "users.json",
    "domains.json",
    "events.json",
    "registration.json",
    "halls.json",
    "purchase.json",
    "gc.json", // gc must come before transport
    "transport.json",
    "sponsorship.json",
    "rnr.json",
    "finance.json",
  ];

  // 1. Clear all existing data in the correct order
  await deleteAllData([...orderedFileNames]); // Pass a copy to avoid modifying original array

  // 2. Seed new data in the correct order
  for (const fileName of orderedFileNames) {
    const filePath = path.join(dataDirectory, fileName);
    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const modelName = path.basename(fileName, path.extname(fileName));
    const model: any = prisma[modelName as keyof typeof prisma];

    if (!model) {
      console.error(`No Prisma model matches the file name: ${fileName}`);
      continue;
    }

    // Use createMany for significantly better performance
    await model.createMany({
      data: jsonData,
    });

    console.log(`🌱 Seeded ${modelName} with data from ${fileName}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });