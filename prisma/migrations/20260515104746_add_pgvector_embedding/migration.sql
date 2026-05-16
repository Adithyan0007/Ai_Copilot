CREATE EXTENSION IF NOT EXISTS vector;

ALTER TABLE "DocumentChunk" DROP COLUMN "embedding";

ALTER TABLE "DocumentChunk"
ADD COLUMN "embedding" vector(3072);