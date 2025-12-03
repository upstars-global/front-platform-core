import * as z from "zod";

import {
  createEmailSchema,
  createFormSchema,
} from '../../../../shared';

const emailSchema = createEmailSchema();  

export const RemindFormSchema = createFormSchema({
  login: emailSchema,
});

export type RemindFormSchemaType = z.infer<typeof RemindFormSchema>
