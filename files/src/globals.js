export const HOSTNAME = process.env.HOSTNAME ?? "0.0.0.0";
export const PORT = Number(process.env.PORT ?? 3000);
export const FILES_UPLOADING_DIR = process.env.FILES_UPLOADING_DIR ?? `${process.cwd()}/data`;
export const FILES_URI = process.env.FILES_URI ?? `http://${HOSTNAME}:${PORT}`;
