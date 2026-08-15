import { supabase } from '@/lib/supabase';

export const storage = {
  get<T>(key: string, fallback: T): T {
    try {
      const value = localStorage.getItem(`dd_${key}`);
      return value ? (JSON.parse(value) as T) : fallback;
    } catch {
      return fallback;
    }
  },
  set<T>(key: string, value: T) {
    localStorage.setItem(`dd_${key}`, JSON.stringify(value));
  },
};

export function createLocalService<T extends { id: string }>(key: string, initial: T[]) {
  let records = storage.get(key, initial);
  const save = () => storage.set(key, records);
  return {
    getAll: () => records,
    getById: (id: string) => records.find((r) => r.id === id),
    create: (record: T) => {
      records = [record, ...records];
      save();
      return record;
    },
    update: (id: string, patch: Partial<T>) => {
      records = records.map((r) => (r.id === id ? { ...r, ...patch } : r));
      save();
      return records.find((r) => r.id === id);
    },
    delete: (id: string) => {
      records = records.filter((r) => r.id !== id);
      save();
    },
    reset: () => {
      records = initial;
      save();
    },
  };
}

export interface SupabaseService<T extends { id: string }> {
  getAll: () => T[];
  getById: (id: string) => T | undefined;
  load: () => Promise<void>;
  create: (record: T) => Promise<T>;
  update: (id: string, patch: Partial<T>) => Promise<T | undefined>;
  delete: (id: string) => Promise<void>;
}

export function createSupabaseService<T extends { id: string }>(
  tableName: string,
  fieldMap: Record<string, string>
): SupabaseService<T> {
  let records: T[] = [];

  const toDb = (record: Record<string, unknown>): Record<string, unknown> => {
    const db: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(record)) {
      const dbCol = fieldMap[key];
      if (dbCol) {
        db[dbCol] = value;
      }
    }
    return db;
  };

  return {
    getAll: () => records,
    getById: (id: string) => records.find((r) => r.id === id),
    load: async () => {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      records = (data || []) as unknown as T[];
    },
    create: async (record: T) => {
      const dbRecord = toDb(record as unknown as Record<string, unknown>);
      delete dbRecord['id'];
      const { data, error } = await supabase
        .from(tableName)
        .insert(dbRecord)
        .select()
        .single();
      if (error) throw error;
      const newRecord = data as unknown as T;
      records = [newRecord, ...records];
      return newRecord;
    },
    update: async (id: string, patch: Partial<T>) => {
      const dbPatch = toDb(patch as unknown as Record<string, unknown>);
      const { data, error } = await supabase
        .from(tableName)
        .update(dbPatch)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      const updated = data as unknown as T;
      records = records.map((r) => (r.id === id ? updated : r));
      return updated;
    },
    delete: async (id: string) => {
      const { error } = await supabase.from(tableName).delete().eq('id', id);
      if (error) throw error;
      records = records.filter((r) => r.id !== id);
    },
  };
}
