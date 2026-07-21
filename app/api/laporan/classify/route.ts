import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { analyzeWasteImage } from "@/server/integrations/gemini/gemini.client";
import { findUploadById } from "@/server/modules/upload/upload.repository";

export async function POST(request: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: request.headers });
        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized", code: "AUTH" },
                { status: 401 },
            );
        }

        const body = await request.json();
        const { temporaryImageId } = body;

        if (!temporaryImageId) {
            return NextResponse.json(
                { error: "temporaryImageId is required", code: "VALIDATION" },
                { status: 400 },
            );
        }

        const upload = await findUploadById(temporaryImageId);
        if (!upload) {
            return NextResponse.json(
                {
                    error: "File temporary tidak ditemukan",
                    code: "TEMP_FILE_NOT_FOUND",
                },
                { status: 404 },
            );
        }

        const result = await analyzeWasteImage(
            upload.secure_url,
            upload.mime_type,
        );

        console.log(result);

        return NextResponse.json(
            {
                analysis: {
                    sizeCategory: result.sizeCategory,
                    wasteTypes: result.wasteTypes,
                    drainageRisk: result.drainageRisk,
                    obstructionRisk: result.accessObstructionRisk,
                    visualIndicators: result.visualIndicators,
                    confidence: result.confidence,
                    needsManualReview: result.needsManualReview,
                },
            },
            { status: 200 },
        );
    } catch (error) {
        console.log(error);
        const message =
            error instanceof Error ? error.message : "Internal server error";
        return NextResponse.json(
            { error: message, code: "AI_SERVICE" },
            { status: 502 },
        );
    }
}
