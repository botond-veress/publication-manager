import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { parse, stringify } from 'query-string';

interface QueryParams {
  query: string;
  // TODO: add pagination and filters
}

const parseQueryParams = (search: string): QueryParams => {
  const { query } = parse(search) as unknown as {
    [x in keyof QueryParams]?: string;
  };

  return { query: query ?? '' } as QueryParams;
};

export const useSearchQueryParams = () => {
  const navigate = useNavigate();
  const { search } = useLocation();

  return React.useMemo(() => {
    const params = parseQueryParams(search);

    const set = (params: QueryParams) => navigate({ search: stringify(params) }, { replace: true });

    const update = (paramsToUpdate: Partial<QueryParams>) => {
      return set({ ...params, ...paramsToUpdate } as QueryParams);
    };

    return { params, update };
  }, [navigate, search]);
};
