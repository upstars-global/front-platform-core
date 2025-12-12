import * as z from "zod";

import {
  createFormSchema,
} from '../../../../shared';
import { authEmailSchema } from "./schemas"; 

export const RemindFormSchema = createFormSchema({
  login: authEmailSchema,
});

export type RemindFormSchemaType = z.infer<typeof RemindFormSchema>
