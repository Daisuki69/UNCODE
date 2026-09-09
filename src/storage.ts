import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

/**
 * Saves JSON data to the native app data directory, bypassing WebView storage limits.
 */
export async function saveData(filename: string, data: any): Promise<void> {
  try {
    const jsonString = JSON.stringify(data);
    await Filesystem.writeFile({
      path: filename,
      data: jsonString,
      directory: Directory.Data,
      encoding: Encoding.UTF8,
    });
  } catch (error) {
    console.error(`Failed to save ${filename} natively:`, error);
    // Fallback to localStorage just in case native fails (e.g. in web dev mode)
    localStorage.setItem(filename, JSON.stringify(data));
  }
}

/**
 * Loads JSON data from the native app data directory.
 * If the file is not found (e.g. first run after migration), it will attempt
 * to load from localStorage as a fallback/migration path.
 */
export async function loadData<T>(filename: string, defaultValue: T): Promise<T> {
  try {
    const contents = await Filesystem.readFile({
      path: filename,
      directory: Directory.Data,
      encoding: Encoding.UTF8,
    });
    return JSON.parse(contents.data as string) as T;
  } catch (error) {
    console.log(`Native file ${filename} not found or failed to read. Checking localStorage migration fallback...`);
    const fallback = localStorage.getItem(filename);
    if (fallback) {
      try {
        return JSON.parse(fallback) as T;
      } catch (parseError) {
        return defaultValue;
      }
    }
    return defaultValue;
  }
}
