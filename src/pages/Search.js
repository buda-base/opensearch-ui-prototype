// Core
import React from "react";

// Utils
import Client from "@searchkit/instantsearch-client";
import Searchkit from "searchkit";

// Components
import {
  InstantSearch,
  SearchBox,
  Hits,
  RefinementList,
  Pagination,
  Configure,
} from "react-instantsearch";
import { history } from "instantsearch.js/es/lib/routers";

// import { InstantSearch } from "react-instantsearch-dom";

import CustomHit from "../components/CustomHit";
// import CustomHits from "./components/CustomHits";

// Constants
import {
  SEARCH_FIELDS,
  RESULT_FIELDS,
  HIGHLIGHT_FIELDS,
} from "../constants/fields";

const FACET_ATTRIBUTES = [
  {
    attribute: "language",
    field: "language",
    type: "string",
  },
  {
    attribute: "script",
    field: "script",
    type: "string",
  },

  { attribute: "inCollection", field: "inCollection", type: "string" },
  {
    attribute: "associatedTradition",
    field: "associatedTradition",
    type: "string",
  },
  { attribute: "personGender", field: "personGender", type: "string" },
  { attribute: "printMethod", field: "printMethod", type: "string" },
  { attribute: "script", field: "script", type: "string" },
  { attribute: "workIsAbout", field: "workIsAbout", type: "string" },
  { attribute: "workGenre", field: "workGenre", type: "string" },
  { attribute: "author", field: "author", type: "string" },
  {
    attribute: "translator",
    field: "translator",
    type: "string",
    facetResponse: (aggregation) => {
      const buckets = aggregation.buckets;
      const test = Object.values(buckets).reduce(
        (sum, bucket) => ({
          ...sum,
          [`${bucket.key} - test`]: bucket.doc_count,
        }),
        {}
      );

      return test;
    },
    filterQuery: (field, value) => {
      // make your own request
      return { match: { [field]: value.split(" - test")[0] } };
    },
  },
];

// Create a Searchkit client
// This is the configuration for Searchkit, specifying the fields to attributes used for search, facets, etc.
const sk = new Searchkit({
  connection: {
    host: process.env.REACT_APP_ELASTICSEARCH_HOST,
    headers: {
      // optional headers sent to Elasticsearch or elasticsearch proxy
      Authorization: `Basic ${process.env.REACT_APP_ELASTICSEARCH_BASIC_AUTH}`,
    },
  },

  search_settings: {
    search_attributes: SEARCH_FIELDS.filter(
      (_field) => _field.highlightable
    ).map((_field) => _field.label),
    result_attributes: RESULT_FIELDS.map((_field) => _field.label),
    highlight_attributes: HIGHLIGHT_FIELDS.filter(
      (_field) => _field.highlightable
    ).map((_field) => _field.label),
    facet_attributes: FACET_ATTRIBUTES,
  },
});

const routing = {
  router: history(),
  stateMapping: {
    stateToRoute(uiState) {
      const indexUiState = uiState[process.env.REACT_APP_ELASTICSEARCH_INDEX];
      return {
        q: indexUiState.query,
        ...FACET_ATTRIBUTES.reduce(
          (obj, item) =>
            Object.assign(obj, {
              [item.attribute]: indexUiState.refinementList?.[item.attribute],
            }),
          {}
        ),
        page: indexUiState.page,
      };
    },
    routeToState(routeState) {
      return {
        [process.env.REACT_APP_ELASTICSEARCH_INDEX]: {
          query: routeState.q,
          refinementList: {
            ...FACET_ATTRIBUTES.reduce(
              (obj, item) =>
                Object.assign(obj, {
                  [item.attribute]: routeState?.[item.attribute],
                }),
              {}
            ),
          },
          page: routeState.page,
        },
      };
    },
  },
};

const searchClient = Client(sk);

// let searchInput = "";
const SearchPage = () => {
  return (
    <div className="App">
      <InstantSearch
        indexName={process.env.REACT_APP_ELASTICSEARCH_INDEX}
        routing={routing}
        searchClient={searchClient}
      >
        <div className="content">
          <div className="filter">
            {/* <div className="filter-title">Languages</div>
            <RefinementList attribute="language" />
            <div className="filter-title">Scripts</div>
            <RefinementList attribute="script" /> */}

            <div className="filter-title">inCollection</div>
            <RefinementList attribute="inCollection" showMore={true} />

            <div className="filter-title">associatedTradition</div>
            <RefinementList attribute="associatedTradition" showMore={true} />

            <div className="filter-title">personGender</div>
            <RefinementList attribute="personGender" showMore={true} />

            <div className="filter-title">printMethod</div>
            <RefinementList attribute="printMethod" showMore={true} />

            <div className="filter-title">script</div>
            <RefinementList attribute="script" showMore={true} />

            <div className="filter-title">workIsAbout</div>
            <RefinementList attribute="workIsAbout" showMore={true} />

            <div className="filter-title">workGenre</div>
            <RefinementList attribute="workGenre" showMore={true} />

            <div className="filter-title">author</div>
            <RefinementList attribute="author" showMore={true} />

            <div className="filter-title">translator</div>
            <RefinementList attribute="translator" showMore={true} />
          </div>
          <div>
            <div className="search">
              <SearchBox
                queryHook={(query, search) => {
                  // setSearchInput(query);
                  // searchInput = query;
                  search(query);
                }}
              />
            </div>
            <div className="hits">
              <Configure hitsPerPage={20} />
              <Hits hitComponent={CustomHit} />
              <div className="pagination">
                <Pagination />
              </div>
            </div>
          </div>
        </div>
        {/* <CustomHits /> */}
      </InstantSearch>
    </div>
  );
};

export default SearchPage;
