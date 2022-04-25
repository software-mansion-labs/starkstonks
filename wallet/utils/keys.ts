import useSWR from "swr";
import { KeyPair } from "starknet";

const storeName = "KeyStorage";

const withIndexedDb = (handler: (db: IDBObjectStore) => void): Promise<void> => {
  const indexedDB = window.indexedDB;
  const open = indexedDB.open(storeName, 1);

  open.onupgradeneeded = () => {
    const db = open.result;
    db.createObjectStore(storeName, { keyPath: "id" });
  };
  return new Promise((res, rej) => {
    open.onsuccess = () => {
      const db = open.result;
      const tx = db.transaction([storeName], "readwrite");
      const store = tx.objectStore(storeName);
      handler(store);
      tx.oncomplete = () => {
        db.close();
      };
      tx.onerror = rej;
    };
    open.onerror = rej;
  })
};

const keyId = 1;

export const saveKeys = async (keys: CryptoKeyPair) => {
  // TODO: Handle errors
  await withIndexedDb(db => {
    db.put({ id: keyId, keys });
  });
}

export const loadKeys = async (): Promise<CryptoKeyPair> => {
  return new Promise((res, rej) => {
    withIndexedDb(db => {
      const result = db.get(keyId);
      result.onsuccess = () => {
        res(result.result?.keys);
      }
      result.onerror = rej;
    });
  });
}

export const generateKeys = async () => {
  const keys = await window.crypto.subtle.generateKey(
    { name: "ECDSA", namedCurve: "P-256" },
    true,
    ["sign", "verify"]
  );
  await saveKeys(keys);
}

export const useGetKey = () => useSWR("key", async () => ({ keys: await loadKeys() }));

export const generateKeysFromPassphrase = (passphrase: string) => generateKeys(); // FIXME