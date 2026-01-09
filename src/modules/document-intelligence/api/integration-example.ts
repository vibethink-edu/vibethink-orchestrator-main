/**
 * Document Intelligence API - Express/Next.js Integration Example
 * 
 * This file shows how to integrate the Document Intelligence routes
 * with Express or Next.js API routes.
 * 
 * @module document-intelligence/api/integration-example
 * @version 2.0.0
 */

import { DocumentIntelligenceRoutes, ApiError } from './routes.js';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Create Document Intelligence router for Express
 * 
 * @example
 * ```typescript
 * import express from 'express';
 * import { createDocumentIntelligenceRouter } from './api/integration-example';
 * 
 * const app = express();
 * const router = createDocumentIntelligenceRouter(supabaseClient, s3Config);
 * app.use('/api/document-intelligence', router);
 * ```
 */
export function createDocumentIntelligenceRouter(
    supabaseClient: SupabaseClient,
    s3Config: { bucket: string; region: string; credentials?: any }
) {
    const routes = new DocumentIntelligenceRoutes(supabaseClient, s3Config);

    // This is a framework-agnostic handler
    // Adapt to Express, Fastify, or Next.js as needed

    return {
        /**
         * POST /documents
         */
        async ingest(req: any, res: any) {
            try {
                const apiKey = req.headers['authorization']?.replace('Bearer ', '');

                // Validate multipart/form-data
                if (!req.file) {
                    return res.status(400).json({
                        error: { code: 'MISSING_FILE', message: 'File is required' },
                    });
                }

                const response = await routes.ingestDocument({
                    apiKey,
                    file: {
                        originalname: req.file.originalname,
                        mimetype: req.file.mimetype,
                        size: req.file.size,
                        buffer: req.file.buffer,
                    },
                    document_profile_id: req.body.document_profile_id,
                    facility_id: req.body.facility_id,
                    external_reference: req.body.external_reference,
                });

                return res.status(201).json(response);

            } catch (error) {
                return handleError(error, res);
            }
        },

        /**
         * GET /documents/:id
         */
        async getJob(req: any, res: any) {
            try {
                const apiKey = req.headers['authorization']?.replace('Bearer ', '');

                const response = await routes.getJobStatus({
                    apiKey,
                    job_id: req.params.id,
                });

                return res.status(200).json(response);

            } catch (error) {
                return handleError(error, res);
            }
        },

        /**
         * GET /documents/:id/items
         */
        async getItems(req: any, res: any) {
            try {
                const apiKey = req.headers['authorization']?.replace('Bearer ', '');

                const response = await routes.getJobItems({
                    apiKey,
                    job_id: req.params.id,
                    include_reviews: req.query.include_reviews === 'true',
                    limit: req.query.limit ? parseInt(req.query.limit) : undefined,
                    cursor: req.query.cursor,
                });

                return res.status(200).json(response);

            } catch (error) {
                return handleError(error, res);
            }
        },
    };
}

/**
 * Handle API errors
 */
function handleError(error: any, res: any) {
    if (error instanceof ApiError) {
        return res.status(error.statusCode).json({
            error: {
                code: error.code,
                message: error.message,
            },
        });
    }

    // Unknown error
    console.error('[API] Unexpected error:', error);
    return res.status(500).json({
        error: {
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred',
        },
    });
}

/**
 * Next.js API Route Example
 * 
 * File: app/api/document-intelligence/documents/route.ts
 * 
 * @example
 * ```typescript
 * import { NextRequest, NextResponse } from 'next/server';
 * import { DocumentIntelligenceRoutes } from '@/modules/document-intelligence/api/routes';
 * import { supabase } from '@/integrations/supabase/client';
 * 
 * const routes = new DocumentIntelligenceRoutes(supabase, {
 *   bucket: process.env.AWS_S3_BUCKET!,
 *   region: process.env.AWS_REGION!,
 * });
 * 
 * export async function POST(request: NextRequest) {
 *   try {
 *     const formData = await request.formData();
 *     const file = formData.get('file') as File;
 *     const document_profile_id = formData.get('document_profile_id') as string;
 *     
 *     const buffer = Buffer.from(await file.arrayBuffer());
 *     
 *     const response = await routes.ingestDocument({
 *       apiKey: request.headers.get('authorization')?.replace('Bearer ', ''),
 *       file: {
 *         originalname: file.name,
 *         mimetype: file.type,
 *         size: file.size,
 *         buffer,
 *       },
 *       document_profile_id,
 *     });
 *     
 *     return NextResponse.json(response, { status: 201 });
 *     
 *   } catch (error) {
 *     if (error instanceof ApiError) {
 *       return NextResponse.json(
 *         { error: { code: error.code, message: error.message } },
 *         { status: error.statusCode }
 *       );
 *     }
 *     
 *     return NextResponse.json(
 *       { error: { code: 'INTERNAL_SERVER_ERROR', message: 'Unexpected error' } },
 *       { status: 500 }
 *     );
 *   }
 * }
 * ```
 */

/**
 * Express Router Example
 * 
 * @example
 * ```typescript
 * import express from 'express';
 * import multer from 'multer';
 * import { createDocumentIntelligenceRouter } from './api/integration-example';
 * 
 * const app = express();
 * const upload = multer({ storage: multer.memoryStorage() });
 * const docIntelRouter = createDocumentIntelligenceRouter(supabaseClient, s3Config);
 * 
 * app.post('/api/document-intelligence/documents', upload.single('file'), docIntelRouter.ingest);
 * app.get('/api/document-intelligence/documents/:id', docIntelRouter.getJob);
 * app.get('/api/document-intelligence/documents/:id/items', docIntelRouter.getItems);
 * 
 * app.listen(3000);
 * ```
 */
