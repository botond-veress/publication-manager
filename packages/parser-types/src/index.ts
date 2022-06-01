import { Publication } from '@botondveress/publication-core';

export interface PublicationMetadataFile {
  id: string;
  bucket: string;
  key: string;
  handle: string;
  publication: Publication;
}
