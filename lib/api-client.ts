export type ApiResponse<T> = {
    success: boolean;
    message?: string;
    data: T;
    errorCode?: string;
};

export class ApiError extends Error {
    constructor(
        message: string,
        public readonly status: number,
        public readonly code?: string,
    ) {
        super(message);
        this.name = "ApiError";
    }
}

type ApiFetchOptions = RequestInit & {
    timeoutMs?: number;
};

export async function apiFetch<T>(
    url: string,
    options: ApiFetchOptions = {},
): Promise<T> {
    const { timeoutMs = 15_000, headers, ...requestOptions } = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const response = await fetch(url, {
            ...requestOptions,
            signal: controller.signal,
            headers: {
                Accept: "application/json",
                ...headers,
            },
        });

        const payload = (await response
            .json()
            .catch(() => null)) as
            | (ApiResponse<T> & { error?: string; code?: string })
            | null;

        if (!response.ok || !payload?.success) {
            throw new ApiError(
                payload?.message ??
                    payload?.error ??
                    "Permintaan tidak dapat diproses",
                response.status,
                payload?.errorCode ?? payload?.code,
            );
        }

        return payload.data;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }

        if (error instanceof DOMException && error.name === "AbortError") {
            throw new ApiError(
                "Waktu permintaan habis",
                408,
                "REQUEST_TIMEOUT",
            );
        }

        throw new ApiError("Gagal terhubung ke server", 0, "NETWORK_ERROR");
    } finally {
        clearTimeout(timeoutId);
    }
}
