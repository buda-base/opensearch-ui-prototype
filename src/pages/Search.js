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
  SortBy,
} from "react-instantsearch";

// Custom
import CustomHit from "../components/CustomHit";
import CustomDateRange from "../components/CustomDateRange";
import SearchBoxAutocomplete from "../components/SearchBoxAutocomplete";
import RefinementListWithLabels from "../components/RefinementListWithLabels";
import NumericList from "../components/NumericList";

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
            <div className="filter-title">Sort by</div>

            <SortBy
              items={[
                {
                  label: "default",
                  value: process.env.REACT_APP_ELASTICSEARCH_INDEX,
                },
                {
                  label: "sync scan date",
                  value: "firstScanSyncDate_desc",
                },

                {
                  label: "publication date (most recent) ",
                  value: "publicationDate_desc",
                },

                {
                  label: "publication date (oldest)",
                  value: "publicationDate_asc",
                },
              ]}
            />

            <div className="filter-title">type</div>
            <RefinementList attribute="type" showMore={true} />

            <div className="filter-title">firstScanSyncDate</div>
            <CustomDateRange attribute="firstScanSyncDate" />

            <div className="filter-title">scans access</div>
            <RefinementList attribute="scans_access" showMore={true} />

            <div className="filter-title">etext access</div>
            <RefinementList attribute="etext_access" showMore={true} />

            <div className="filter-title">etext quality</div>
            <RefinementList attribute="etext_quality" />
            
            {/*items={[
                {
                  label:"manual-aligned", start:4, end:4
                },{
                  label:"manual-unaligned", start:3, end:3
                },{
                  label:"revised-OCR", start:2, end:2
                },{
                  label:"high", start:0.95, end:1
                },{
                  label:"medium", start:0.8, end:0.95
                },{
                  label:"poor", start:0, end:0.8
                }
              ]}
            />
            {/* // display is fine but runtime error filtering on merged items
            <RefinementList attribute="etext_quality" transformItems={(items) => {
              const newItems = []
              let lo, mid, hi
              for(const item of items) {
                console.log("item:",item)
                if([1,2,3,4].includes(Number(item.value))) newItems.push(item)
                else {
                  const val = Number(item.value)
                  if(val > 0.95) {
                    if(!hi) { 
                      hi = { ...item, label:"hi", value:window.encodeURI('{"start":0.95,"end":1}') } 
                    }
                    else {
                      hi.count += item.count
                    }
                  }
                  else if(val > 0.8) {
                    if(!mid) { 
                      mid = { ...item, label:"mid", value:window.encodeURI('{"start":0.8,"end":0.95}') } 
                    }
                    else {
                      mid.count += item.count
                    }
                  }
                  else if(val > 0) {
                    if(!lo) { 
                      lo = { ...item, label:"lo", value:window.encodeURI('{"start":0,"end":0.8}') } 
                    }
                    else {
                      lo.count += item.count
                    }
                  }
                }
              } 
              if(hi) newItems.push(hi)
              if(mid) newItems.push(mid)
              if(lo) newItems.push(lo)
              return newItems
            }}/> */}

            <div className="filter-title">inCollection</div>
            <RefinementListWithLabels
              attribute="inCollection"
              showMore={true}
            />
            <div className="filter-title">language</div>
            <RefinementList attribute="language" showMore={true} />

            <div className="filter-title">associatedTradition</div>
            <RefinementList attribute="associatedTradition" showMore={true} />

            <div className="filter-title">personGender</div>
            <RefinementList attribute="personGender" showMore={true} />

            <div className="filter-title">printMethod</div>
            <RefinementList attribute="printMethod" showMore={true} />

            <div className="filter-title">script</div>
            <RefinementList attribute="script" showMore={true} />

            <div className="filter-title">workIsAbout</div>
            <RefinementListWithLabels attribute="workIsAbout" showMore={true} />

            <div className="filter-title">workGenre</div>
            <RefinementListWithLabels attribute="workGenre" showMore={true} />

            <div className="filter-title">author</div>
            <RefinementListWithLabels attribute="author" showMore={true} />

            <div className="filter-title">translator</div>
            <RefinementListWithLabels attribute="translator" showMore={true} />

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
