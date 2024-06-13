// Core
import React from "react";

// Utils
import Client from "@searchkit/instantsearch-client";

// Config
import SearchkitConfig, { routingConfig } from "../searchkit.config";

// API
import { getCustomizedBdrcIndexRequest } from "../api/ElasticAPI";

// Components
import {
  InstantSearch,
  SearchBox,
  Hits,
  RefinementList,
  Pagination,
  Configure,
} from "react-instantsearch";

// Custom
import CustomHit from "../components/CustomHit";
import SearchBoxAutocomplete from "../components/SearchBoxAutocomplete";

const searchClient = Client(
  SearchkitConfig,
  {
    hooks: {
      beforeSearch: async (requests) => {
        const customizedRequest = requests.map((request) => {
          if (request.indexName === process.env.REACT_APP_ELASTICSEARCH_INDEX) {
            return getCustomizedBdrcIndexRequest(request);
          }
          return request;
        });

        return customizedRequest;
      },
    },
  },
  { debug: process.env.NODE_ENV === "development" }
);

const SearchPage = () => {
  return (
    <div className="App">
      <InstantSearch
        indexName={process.env.REACT_APP_ELASTICSEARCH_INDEX}
        routing={routingConfig}
        searchClient={searchClient}
      >
        <div className="content">
          <div className="filter">
            <div className="filter-title">type</div>
            <RefinementList attribute="type" showMore={true} />

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

            <div className="filter-title">associatedCentury</div>
            <RefinementList attribute="associatedCentury" showMore={true} />
          </div>
          <div className="main-content">
            <div className="search">
              <SearchBoxAutocomplete />
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
