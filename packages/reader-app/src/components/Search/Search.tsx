import React from 'react';
import { useNavigate } from 'react-router';
import { SearchIcon } from '@heroicons/react/outline';
import { useCombobox } from 'downshift';
import { AlgoliaPublication, AlgoliaPublicationContent } from '@botondveress/algolia-types';

import { AutocompleteResponse, getAutocomplete } from '@/services/autocomplete';
import { resizeImage } from '@/services/image';

import { SearchResultGroup } from './SearchResultGroup';
import { SearchResult } from './SearchResult';
import { SearchMenu } from './SearchMenu';
import { SearchInput } from './SearchInput';

interface SearchResultItem<I = undefined> {
  item: I;
  index: number;
  name: string;
  onSelect(): void;
}

interface SearchProps {
  id: string;
  value: string;
  placeholder?: string;
  onSearch(input: string): void;
}

export const Search: React.FC<React.PropsWithChildren<SearchProps>> = (props) => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = React.useState(props.value);

  const [response, setResponse] = React.useState<AutocompleteResponse>();

  const { items, suggestions, publications, contents } = React.useMemo(() => {
    const trimmedInputValue = inputValue.trim();

    const staticItems: SearchResultItem<string>[] = trimmedInputValue
      ? [
          {
            item: trimmedInputValue,
            index: 0,
            name: trimmedInputValue,
            onSelect: () => props.onSearch(trimmedInputValue)
          }
        ]
      : [];

    if (!response) {
      return {
        items: staticItems,
        suggestions: staticItems,
        publications: { count: 0, items: [] },
        contents: { count: 0, items: [] }
      };
    }

    const suggestions = staticItems.concat(
      response.suggestion.items
        .filter((item) => staticItems.filter((staticItem) => item.query == staticItem.item).length < 1)
        .map<SearchResultItem<string>>((item, index) => ({
          item: item.query,
          index: index + staticItems.length,
          name: item.query,
          onSelect: () => props.onSearch(item.query)
        }))
    );

    const publications = response.publication.items.map<SearchResultItem<AlgoliaPublication>>((item, index) => ({
      item,
      index: index + suggestions.length,
      name: item.title,
      onSelect: () => navigate(`/publications/${item.handle}`, { replace: true })
    }));

    const contents = response.content.items.map<SearchResultItem<AlgoliaPublicationContent>>((item, index) => ({
      item,
      index: index + suggestions.length + publications.length,
      name: item.content,
      onSelect: () => navigate(`/publications/${item.handle}?locator=${item.locator}`, { replace: true })
    }));

    return {
      items: [...suggestions, ...publications, ...contents],
      suggestions,
      publications: { count: response.publication.count, items: publications },
      contents: { count: response.content.count, items: contents }
    };
  }, [navigate, response, props, inputValue]);

  const onAutocomplete = React.useCallback(
    (inputValue?: string) => getAutocomplete({ query: inputValue ?? '' }).then(setResponse),
    []
  );

  const { isOpen, highlightedIndex, getMenuProps, getItemProps, getInputProps, getComboboxProps, openMenu } =
    useCombobox({
      id: props.id,
      inputId: props.id,
      inputValue,
      defaultInputValue: props.value,
      initialInputValue: props.value,
      initialHighlightedIndex: 0,
      defaultHighlightedIndex: 0,
      items,
      itemToString(item) {
        return item?.name ?? '';
      },
      onInputValueChange({ inputValue }) {
        setInputValue(inputValue ?? '');
        return onAutocomplete(inputValue);
      },
      onIsOpenChange({ isOpen, inputValue }) {
        if (!isOpen) return;
        return onAutocomplete(inputValue);
      },
      onSelectedItemChange({ selectedItem }) {
        selectedItem?.onSelect();
      }
    });

  return (
    <div {...getComboboxProps({ className: 'relative max-w-[480px] w-full' })}>
      <SearchInput
        {...getInputProps({
          placeholder: props.placeholder,
          onFocus: openMenu
        })}
        onClear={() => {
          setInputValue('');
          props.onSearch('');
        }}
      />

      <SearchMenu
        {...{ isOpen }}
        {...getMenuProps({ className: 'absolute top-full right-0 z-10 w-full' }, { suppressRefError: true })}
      >
        {suggestions.length > 0 && (
          <SearchResultGroup>
            {suggestions.map((item, index) => (
              <SearchResult
                key={index}
                as="li"
                highlighted={highlightedIndex === item.index}
                {...getItemProps({ item, index: item.index, className: 'items-center' })}
              >
                <SearchIcon className="w-4 h-4 flex-shrink-0 text-gray-400" />
                <div className="flex-1">{item.item}</div>
              </SearchResult>
            ))}
          </SearchResultGroup>
        )}

        {publications.items.length > 0 && (
          <div>
            <SearchResultGroup title={`Publications (${publications.count})`}>
              {publications.items.map((item) => (
                <SearchResult
                  key={item.item.objectID}
                  as="li"
                  highlighted={highlightedIndex === item.index}
                  {...getItemProps({ item, index: item.index, className: 'items-center' })}
                >
                  <div className="flex-shrink-0 relative block w-9 h-9 border border-solid border-gray-200 rounded bg-gray-100">
                    {!!item.item.image && (
                      <img
                        src={resizeImage(item.item.image, { width: 100, height: 100 })}
                        className="absolute inset-0 object-cover overflow-hidden"
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="truncate font-medium text-gray-800">{item.item.title}</div>
                  </div>
                </SearchResult>
              ))}
            </SearchResultGroup>
          </div>
        )}

        {contents.items.length > 0 && (
          <SearchResultGroup title={`Contents (${contents.count})`}>
            {contents.items.map((item) => (
              <SearchResult
                key={item.item.objectID}
                as="li"
                highlighted={highlightedIndex === item.index}
                {...getItemProps({ item, index: item.index, className: 'items-start' })}
              >
                <div className="flex-shrink-0 relative block w-9 h-9 border border-solid border-gray-200 rounded bg-gray-100">
                  {!!item.item.image && (
                    <img
                      src={resizeImage(item.item.image, { width: 100, height: 100 })}
                      className="absolute inset-0 object-cover overflow-hidden"
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="truncate font-medium text-gray-800">{item.item.title}</div>
                  <div className="max-h-10 text-gray-400 overflow-hidden">{item.item.content}</div>
                </div>
              </SearchResult>
            ))}
          </SearchResultGroup>
        )}
      </SearchMenu>
    </div>
  );
};
