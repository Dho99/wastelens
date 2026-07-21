const uploads: Map<string, { user_id: string; secure_url: string; mime_type: string; size_bytes: number; public_id: string }> = new Map();

export async function findUploadById(id: string) {
  return uploads.get(id) ?? null;
}

export async function markAsUsed(id: string): Promise<void> {
}
