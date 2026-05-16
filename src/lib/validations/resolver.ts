import { zodResolver } from "@hookform/resolvers/zod"
import type { FieldValues, Resolver } from "react-hook-form"
import type { z } from "zod"

export function zodFormResolver<T extends FieldValues>(schema: z.ZodType<T>): Resolver<T> {
  return zodResolver(schema as never) as Resolver<T>
}
