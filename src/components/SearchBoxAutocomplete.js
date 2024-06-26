import { useState, useRef, useCallback, useEffect } from "react";

// hooks
import { useSearchBox, useInstantSearch } from "react-instantsearch";

// utils
import { debounce } from "../helpers/utils";

// api
import { getAutocompleteRequest } from "../api/AutosuggestAPI";

const SearchBoxAction = ({ inputValue, isSearchStalled }) => {
  return (
    <>
      <button type="submit" className="ais-SearchBox-submit">
        Submit
      </button>
      <button
        className="ais-SearchBox-reset"
        type="reset"
        title="Clear the search query"
        hidden={inputValue.length === 0 || isSearchStalled}
      >
        <svg
          className="ais-SearchBox-resetIcon"
          viewBox="0 0 20 20"
          width="10"
          height="10"
          aria-hidden="true"
        >
          <path d="M8.114 10L.944 2.83 0 1.885 1.886 0l.943.943L10 8.113l7.17-7.17.944-.943L20 1.886l-.943.943-7.17 7.17 7.17 7.17.943.944L18.114 20l-.943-.943-7.17-7.17-7.17 7.17-.944.943L0 18.114l.943-.943L8.113 10z"></path>
        </svg>
      </button>
      <span hidden={!isSearchStalled}>
        <span className="ais-SearchBox-loadingIndicator" hidden="">
          <svg
            width="16"
            height="16"
            viewBox="0 0 38 38"
            stroke="#444"
            className="ais-SearchBox-loadingIcon"
            aria-hidden="true"
          >
            <g fill="none" fillRule="evenodd">
              <g transform="translate(1 1)" strokeWidth="2">
                <circle strokeOpacity=".5" cx="18" cy="18" r="18"></circle>
                <path d="M36 18c0-9.94-8.06-18-18-18">
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 18 18"
                    to="360 18 18"
                    dur="1s"
                    repeatCount="indefinite"
                  ></animateTransform>
                </path>
              </g>
            </g>
          </svg>
        </span>
      </span>
    </>
  );
};

const SuggestsList = ({ items, onClick, isVisible, setIsVisible }) => {
  return (
    <ul className="search-result-wrapper" hidden={!isVisible}>
      {items.map((_suggest, _index) => (
        <li
          key={_index}
          className="search-result-item"
          onClick={() => onClick(_suggest)}
        >
          <span className="search-result-item-lang">{_suggest.lang}</span>
          <span
            className="search-result-item-res"
            dangerouslySetInnerHTML={{ __html: _suggest.res }}
          ></span>
          <span className="search-result-item-category">
            {_suggest.category}
          </span>
        </li>
      ))}
    </ul>
  );
};

const formatResponseForURLSearchParams = (query) => {
  return query.split("<suggested>").join("").split("</suggested>").join("");
};

const SearchBoxAutocomplete = (props) => {
  const { query, refine } = useSearchBox(props);
  const { status } = useInstantSearch();

  const [inputValue, setInputValue] = useState(query);
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const inputRef = useRef(null);

  const isSearchStalled = status === "stalled";

  useEffect(() => {
    if (query !== "") {
      getAutocompleteRequest(query).then((requests) => {
        setSuggestions(requests);
      });
    }
  }, []);

  const setQuery = (newQuery) => {
    setInputValue(newQuery);
    if (newQuery.length === 0) {
      setSuggestions([]);
    }

    refine(newQuery);
  };

  const debouncedHandleChange = useCallback(
    debounce((newValue) => {
      getAutocompleteRequest(newValue).then((requests) => {
        setSuggestions(requests);
      });
    }, 350),
    []
  );

  return (
    <form
      action=""
      role="search"
      className="ais-SearchBox-form search-input"
      noValidate
      onBlur={() => {
        setTimeout(() => {
          setIsFocused(false);
        }, 200);
      }}
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();

        if (inputRef.current) {
          inputRef.current.blur();
        }
      }}
      onReset={(event) => {
        event.preventDefault();
        event.stopPropagation();

        setQuery("");

        if (inputRef.current) {
          inputRef.current.focus();
        }
      }}
    >
      <input
        ref={inputRef}
        className="ais-SearchBox-input"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        maxLength={512}
        type="search"
        value={inputValue}
        onFocus={() => {
          setIsFocused(true);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setIsFocused(false);
          }
        }}
        onChange={(event) => {
          setIsFocused(true);
          const newQuery = event.currentTarget.value;
          setQuery(newQuery);
          if (newQuery.length > 0) {
            debouncedHandleChange(newQuery);
          }
        }}
      />
      <SearchBoxAction
        inputValue={inputValue}
        isSearchStalled={isSearchStalled}
      />
      <SuggestsList
        items={suggestions}
        onClick={(item) => {
          const newQuery = formatResponseForURLSearchParams(item.res);
          setQuery(newQuery);
          setIsFocused(false);
        }}
        isVisible={isFocused}
      />
    </form>
  );
};

export default SearchBoxAutocomplete;
