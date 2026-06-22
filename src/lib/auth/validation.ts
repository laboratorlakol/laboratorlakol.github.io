import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username-ul trebuie să aibă cel puțin 3 caractere.")
    .max(20, "Username-ul poate avea maximum 20 de caractere.")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username-ul poate conține doar litere, cifre și underscore."
    ),
  email: z.string().email("Adresă de email invalidă."),
  password: z
    .string()
    .min(8, "Parola trebuie să aibă cel puțin 8 caractere.")
    .regex(/[A-Z]/, "Parola trebuie să conțină cel puțin o literă mare.")
    .regex(/[0-9]/, "Parola trebuie să conțină cel puțin o cifră."),
});

export const loginSchema = z.object({
  email: z.string().email("Adresă de email invalidă."),
  password: z.string().min(1, "Introdu parola."),
});

export const requestPasswordResetSchema = z.object({
  email: z.string().email("Adresă de email invalidă."),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z
    .string()
    .min(8, "Parola trebuie să aibă cel puțin 8 caractere.")
    .regex(/[A-Z]/, "Parola trebuie să conțină cel puțin o literă mare.")
    .regex(/[0-9]/, "Parola trebuie să conțină cel puțin o cifră."),
});
