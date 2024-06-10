import Searchkit from "searchkit";
import { history } from "instantsearch.js/es/lib/routers";

// Constant
import {
  SEARCH_FIELDS,
  RESULT_FIELDS,
  HIGHLIGHT_FIELDS,
} from "./constants/fields";

import { FACET_ATTRIBUTES } from "./constants/facets";

const CONNECTION = {
  host: process.env.REACT_APP_ELASTICSEARCH_HOST,
  headers: {
    // optional headers sent to Elasticsearch or elasticsearch proxy
    Authorization: `Basic ${process.env.REACT_APP_ELASTICSEARCH_BASIC_AUTH}`,
  },
};
// Create a Searchkit client
// This is the configuration for Searchkit, specifying the fields to attributes used for search, facets, etc.
const SearchkitConfig = new Searchkit({
  connection: CONNECTION,
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

const routingConfig = {
  router: history({
    cleanUrlOnDispose: false,
  }),
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

export default SearchkitConfig;
export { routingConfig };
