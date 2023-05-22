import fs from "fs/promises";
import path from "path";
import logger from "../middlewares/logger";

export default async (filePath: string) => {
  const directoryPath = path.join(process.cwd(), "dist", filePath);

  try {
    const result = await fs.readdir(directoryPath);
    logger.debug({
      message: `Checked directory ${filePath}`,
      directoryPath,
      result,
    });
    return result;
  } catch (error) {
    // Handle any errors that occur during the directory check
    logger.error(`Error checking directory ${filePath}: ${error}`);
    throw error;
  }
};
