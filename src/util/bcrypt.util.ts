import bcrypt from 'bcrypt';

export const compare = async (input: string, hashed: string): Promise<boolean> => {
  const same = await bcrypt.compare(input, hashed);
  return same;
};

export const hash = async (password: string): Promise<string> => {
  const encrypted = await bcrypt.hash(password, 10);
  return encrypted;
};
