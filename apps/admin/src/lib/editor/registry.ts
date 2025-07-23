import type { Schema } from "@rekajs/types";

export const SchemaRegistry: Record<string, Schema> = Object.create(null);

export const getTypeSchema = (type: string) => SchemaRegistry[type];