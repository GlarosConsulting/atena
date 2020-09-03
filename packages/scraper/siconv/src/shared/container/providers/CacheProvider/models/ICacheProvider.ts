export default interface ICacheProvider {
  save(key: string, value: any): Promise<void>;
  recover<T>(key: string): Promise<T | null>;
  invalidate(...keys: string[]): Promise<void>;
  invalidatePrefix(...prefixes: string[]): Promise<void>;
}
