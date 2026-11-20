import fs from "fs";
import path from "path";

export interface StorageFile {
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  filePath: string;
}

export interface IStorageProvider {
  uploadFile(fileBuffer: Buffer, fileName: string, mimeType: string, folder?: string): Promise<StorageFile>;
  deleteFile(filePath: string): Promise<boolean>;
  getFileStream(filePath: string): Promise<fs.ReadStream | null>;
  getFileUrl(filePath: string): string;
}

class LocalStorageProvider implements IStorageProvider {
  private baseDir: string;
  private publicUrlBase: string;

  constructor() {
    this.baseDir = path.join(process.cwd(), "public", "uploads");
    this.publicUrlBase = "/uploads";
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
  }

  async uploadFile(fileBuffer: Buffer, fileName: string, mimeType: string, folder = "documents"): Promise<StorageFile> {
    const targetDir = path.join(this.baseDir, folder);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const timestamp = Date.now();
    const sanitizedName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueFileName = `${timestamp}-${sanitizedName}`;
    const destinationPath = path.join(targetDir, uniqueFileName);

    await fs.promises.writeFile(destinationPath, fileBuffer);

    const relativeUrl = `${this.publicUrlBase}/${folder}/${uniqueFileName}`;

    return {
      fileName: uniqueFileName,
      originalName: fileName,
      mimeType,
      size: fileBuffer.length,
      url: relativeUrl,
      filePath: destinationPath,
    };
  }

  async deleteFile(filePath: string): Promise<boolean> {
    try {
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  async getFileStream(filePath: string): Promise<fs.ReadStream | null> {
    if (fs.existsSync(filePath)) {
      return fs.createReadStream(filePath);
    }
    return null;
  }

  getFileUrl(filePath: string): string {
    const relative = path.relative(this.baseDir, filePath).replace(/\\/g, "/");
    return `${this.publicUrlBase}/${relative}`;
  }
}

// Singleton storage instance - readily swappable with S3StorageProvider
export const storage: IStorageProvider = new LocalStorageProvider();
