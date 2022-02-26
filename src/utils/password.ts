import bcrypt from "bcrypt";
const SALT = 10;
export const generatePassword = async (password: string): Promise<string> =>
  await bcrypt.hash(password, SALT);
/**
 * @param plainPassword - plain password from received from user
 * @param hashedPassword - hashed password from database
 * @returns
 */
export async function isVerifiedPass(
  plainPassword = "",
  hashedPassword = ""
): Promise<boolean> {
  return await bcrypt.compare(plainPassword, hashedPassword);
}
