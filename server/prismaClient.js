let prisma;

function createMockPrisma() {
  console.warn('[AI Studio] Database not connected or DATABASE_URL missing — using in-memory store');
  const store = {
    adminUser: [],
    setting: [],
    product: [],
    event: [],
    carouselSlide: [],
    membership: [],
    order: [],
    passwordResetCode: [],
  };
  const idCounters = {};

  const match = (item, where) => {
    if (!where) return true;
    for (const [k, v] of Object.entries(where)) {
      if (v && typeof v === 'object' && !(v instanceof Date)) {
        const val = item[k];
        if (v.gte !== undefined && !(val >= v.gte)) return false;
        if (v.lte !== undefined && !(val <= v.lte)) return false;
        if (v.gt !== undefined && !(val > v.gt)) return false;
        if (v.lt !== undefined && !(val < v.lt)) return false;
      } else if (item[k] !== v) {
        return false;
      }
    }
    return true;
  };

  const createModelHandler = (modelName) => {
    if (!store[modelName]) store[modelName] = [];
    if (!idCounters[modelName]) idCounters[modelName] = 1;

    return {
      count: async ({ where } = {}) => {
        return store[modelName].filter(i => match(i, where)).length;
      },
      findMany: async ({ where, orderBy, take } = {}) => {
        let items = store[modelName].filter(i => match(i, where));
        if (orderBy) {
          const [field, dir] = Object.entries(orderBy)[0] || [];
          if (field) {
            items = [...items].sort((a, b) => {
              if (a[field] < b[field]) return dir === 'desc' ? 1 : -1;
              if (a[field] > b[field]) return dir === 'desc' ? -1 : 1;
              return 0;
            });
          }
        }
        if (take) items = items.slice(0, take);
        return items;
      },
      findFirst: async ({ where, orderBy } = {}) => {
        const items = store[modelName].filter(i => match(i, where));
        if (orderBy) {
          const [field, dir] = Object.entries(orderBy)[0] || [];
          if (field) {
            items.sort((a, b) => {
              if (a[field] < b[field]) return dir === 'desc' ? 1 : -1;
              if (a[field] > b[field]) return dir === 'desc' ? -1 : 1;
              return 0;
            });
          }
        }
        return items[0] || null;
      },
      findUnique: async ({ where } = {}) => {
        return store[modelName].find(i => match(i, where)) || null;
      },
      create: async ({ data }) => {
        const record = {
          id: idCounters[modelName]++,
          createdAt: new Date(),
          updatedAt: new Date(),
          ...data
        };
        store[modelName].push(record);
        return record;
      },
      update: async ({ where, data }) => {
        const item = store[modelName].find(i => match(i, where));
        if (item) {
          Object.assign(item, data, { updatedAt: new Date() });
          return item;
        }
        return data;
      },
      updateMany: async ({ where, data }) => {
        let count = 0;
        for (const item of store[modelName]) {
          if (match(item, where)) {
            Object.assign(item, data, { updatedAt: new Date() });
            count++;
          }
        }
        return { count };
      },
      delete: async ({ where }) => {
        const idx = store[modelName].findIndex(i => match(i, where));
        if (idx !== -1) return store[modelName].splice(idx, 1)[0];
        return {};
      },
      deleteMany: async ({ where } = {}) => {
        const before = store[modelName].length;
        store[modelName] = store[modelName].filter(i => !match(i, where));
        return { count: before - store[modelName].length };
      },
      upsert: async ({ where, update, create }) => {
        let item = store[modelName].find(i => match(i, where));
        if (item) {
          Object.assign(item, update, { updatedAt: new Date() });
        } else {
          item = {
            id: idCounters[modelName]++,
            createdAt: new Date(),
            updatedAt: new Date(),
            ...create
          };
          store[modelName].push(item);
        }
        return item;
      }
    };
  };

  return new Proxy({}, {
    get: (target, prop) => {
      if (typeof prop === 'string') {
        if (!target[prop]) {
          target[prop] = createModelHandler(prop);
        }
        return target[prop];
      }
      return undefined;
    }
  });
}

if (!process.env.DATABASE_URL) {
  prisma = createMockPrisma();
} else {
  try {
    const { PrismaClient } = await import('@prisma/client');
    prisma = new PrismaClient();
  } catch {
    prisma = createMockPrisma();
  }
}

export { prisma };
export default prisma;
