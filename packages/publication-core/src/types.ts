export interface PublicationTOCItem {
  title: string;
  href: string;
  cfi: string;
  items?: PublicationTOCItem[];
}

export interface PublicationContentItem {
  text: string;
  cfi: string;
}

export interface PublicationMetadata {
  title: string;
  description: string;
  language: string;
  author: string;
  publishedAt: string;
}

export interface Publication {
  tocs: PublicationTOCItem[];
  contents: PublicationContentItem[];
  metadata: PublicationMetadata;
  coverImage: string;
}
