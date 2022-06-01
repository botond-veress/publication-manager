import { AssetProps } from 'contentful-management';
import { logger } from '@botondveress/logger';

import { contentful } from './contentful';

export const getAsset = async (id: string) => {
  logger.info({ id }, `Get asset.`);

  return contentful.asset.get({ assetId: id });
};

export const createAsset = async (id: string, fields: AssetProps['fields']) => {
  logger.info({ id, fields }, `Create asset.`);

  return contentful.asset.createWithId({ assetId: id }, { fields });
};

export const updateAsset = async (entry: AssetProps, fields: AssetProps['fields']) => {
  logger.info({ id: entry.sys.id, fields }, `Update asset.`);

  return contentful.asset.update({ assetId: entry.sys.id }, { ...entry, fields: { ...entry.fields, ...fields } });
};

export const upsertAsset = async (id: string, fields: AssetProps['fields']) => {
  logger.info({ id, fields }, `Upsert asset.`);

  const entry = await getAsset(id).catch(() => null);

  if (!entry) return createAsset(id, fields);

  return updateAsset(entry, fields);
};

export const processAsset = async (asset: AssetProps) => {
  logger.info({ assetId: asset.sys.id }, `Process asset.`);

  return await contentful.asset.processForAllLocales({}, asset);
};

export const publishAsset = async (asset: AssetProps) => {
  logger.info({ assetId: asset.sys.id }, `Publish asset.`);

  return contentful.asset.publish({ assetId: asset.sys.id }, asset);
};

export const createLinkFromAsset = (asset: AssetProps) => ({
  sys: { id: asset.sys.id, linkType: 'Asset', type: 'Link' }
});
