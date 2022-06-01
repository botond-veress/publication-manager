import { Link } from 'contentful-management';

export interface ContentfulPublication {
  title: string;
  description: string;
  language: string;
  author: string;
  publisedAt: Date;
  epub: Link<'Asset'>;
  cover: Link<'Asset'>;
}
