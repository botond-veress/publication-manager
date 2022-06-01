const fromHex = (hexString: string) => new Uint8Array(hexString.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)));

interface DecryptOptions {
  data: ArrayBuffer;
  iv: string;
  key: string;
}

export const decryptAESCBC = async (options: DecryptOptions): Promise<ArrayBuffer> => {
  if (!crypto?.subtle) throw new Error(`Your browser is not supported (crypto.subtle).`);

  const rawKey = fromHex(options.key);
  const iv = fromHex(options.iv);

  const key = await crypto.subtle.importKey('raw', rawKey, 'AES-CBC', true, ['decrypt']);

  return crypto.subtle.decrypt({ name: 'AES-CBC', iv }, key, options.data);
};
