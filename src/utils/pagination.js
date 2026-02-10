// pagination helper function
/**
 * ============================================
 * PAGINATION UTILITY — ContentGuard AI
 * ============================================
 *
 * WHY:  Database has 10,000+ analysed content docs.
 *       We cannot send them all at once — browser crashes,
 *       response is slow, memory blows up.
 *       Pagination sends 20 at a time, like Google pages.
 *
 * WHAT: Two exported helpers:
 *       1. parsePaginationParams(query)  — reads page/limit from URL
 *       2. paginateQuery(Model, filter, options) — runs the DB query
 *
 * WHEN: Every GET endpoint that returns a LIST of documents.
 *       → getAllContent(), getFlaggedContent(), etc.
 */

import logger from './logger.js'

// ─────────────────────────────────────────────────────────────────
// 1. PARSE PAGE & LIMIT FROM QUERY STRING
// ─────────────────────────────────────────────────────────────────
/**
 * Reads ?page=2&limit=10 from the URL and returns safe numbers.
 *
 * @param {object} query  — req.query  (the ?page=…&limit=… part)
 * @returns {{ page, limit, skip }}
 *
 * Example:
 *   req.query = { page: "3", limit: "10" }
 *   returns  → { page: 3, limit: 10, skip: 20 }
 *
 *   skip = (page - 1) × limit
 *        = (3   - 1) × 10
 *        = 20   ← skip the first 20 docs, start from doc #21
 */
export function parsePaginationParams(query = {}) {
    // Convert strings to numbers (URL params are always strings)
    let page  = parseInt(query.page)  || 1   // default → page 1
    let limit = parseInt(query.limit) || 20  // default → 20 per page

    // Safety: never go below page 1
    if (page  < 1)   page  = 1
    // Safety: keep limit sensible  (1 – 100)
    if (limit < 1)   limit = 1
    if (limit > 100) limit = 100

    const skip = (page - 1) * limit  // how many docs to jump over

    logger.debug(`Pagination params → page:${page}  limit:${limit}  skip:${skip}`)

    return { page, limit, skip }
}

// ─────────────────────────────────────────────────────────────────
// 2. RUN A PAGINATED MONGOOSE QUERY
// ─────────────────────────────────────────────────────────────────
/**
 * Runs TWO parallel MongoDB queries:
 *   A) .find().skip().limit()   → the actual page of data
 *   B) .countDocuments()        → how many docs exist in total
 *
 * Then builds the pagination metadata object.
 *
 * @param {Model}   Model     — Mongoose model  (e.g. Content)
 * @param {object}  filter    — MongoDB filter  (e.g. { isFlagged: true })
 * @param {object}  options   — { page, limit, sort, select }
 * @returns {{ data, pagination }}
 *
 * Usage:
 *   const result = await paginateQuery(Content, { isFlagged: true }, {
 *       page:   req.query.page,
 *       limit:  req.query.limit,
 *       sort:   { createdAt: -1 },
 *       select: 'text status isFlagged moderationAction createdAt'
 *   })
 *   res.json({ success: true, ...result })
 */
export async function paginateQuery(Model, filter = {}, options = {}) {
    // --- parse numbers ------------------------------------------------
    const { page, limit, skip } = parsePaginationParams({
        page:  options.page,
        limit: options.limit,
    })

    // --- defaults ------------------------------------------------------
    const sort   = options.sort   || { createdAt: -1 }  // newest first
    const select = options.select || ''                  // all fields

    logger.debug(`paginateQuery → model:${Model.modelName}  filter:${JSON.stringify(filter)}`)

    // ── Run both queries at the same time (parallel = faster) ─────────
    const [data, totalItems] = await Promise.all([

        // Query A — the actual documents for this page
        Model.find(filter)
             .sort(sort)
             .skip(skip)
             .limit(limit)
             .select(select)
             .lean(),             // plain JS objects → faster serialisation

        // Query B — total count (needed to calculate totalPages)
        Model.countDocuments(filter),
    ])

    // ── Build metadata ─────────────────────────────────────────────────
    const totalPages    = Math.ceil(totalItems / limit)  // e.g. ceil(95/20) = 5
    const hasNextPage   = page < totalPages
    const hasPrevPage   = page > 1

    const pagination = {
        currentPage:  page,
        itemsPerPage: limit,
        totalItems,
        totalPages,
        hasNextPage,
        hasPrevPage,
        nextPage:  hasNextPage ? page + 1 : null,
        prevPage:  hasPrevPage ? page - 1 : null,
    }

    logger.debug(`paginateQuery result → ${data.length} docs returned, ${totalItems} total`)

    return { data, pagination }
}

export default { parsePaginationParams, paginateQuery }