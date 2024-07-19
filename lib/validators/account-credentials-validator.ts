import { z } from "zod";

export const AuthCredentialValidator = z.object({
	email: z.string().email(),
	password: z
		.string()
		.min(8, { message: "Password needs 8 characters or more" }),
});

export type TAuthCredentialsValidator = z.infer<typeof AuthCredentialValidator>;
