const forgeFacetFilters = (facetFilters) => {
  return facetFilters.map((group) => ({
    bool: {
      should: group.map((facet) => {
        const [field, value] = facet.split(":");
        return { term: { [field]: value } };
      }),
    },
  }));
};

const forgeUserAggregateFacets = (facets, size) => {
  const fields = Array.isArray(facets) ? facets : [facets];

  return fields.reduce((acc, field) => {
    acc[field] = {
      terms: {
        field: field,
        size: size,
      },
    };
    return acc;
  }, {});
};

const getCustomQuery = (query, filter) => {
  return {
    function_score: {
      script_score: {
        script: {
          id: "bdrc-score",
        },
      },
      query: {
        bool: {
          filter: filter,
          must: [
            {
              multi_match: {
                type: "phrase",
                query: query,
                fields: [
                  "seriesName_bo_x_ewts^0.1",
                  "seriesName_en^0.1",
                  "authorshipStatement_bo_x_ewts^0.005",
                  "authorshipStatement_en^0.005",
                  "publisherName_bo_x_ewts^0.01",
                  "publisherLocation_bo_x_ewts^0.01",
                  "publisherName_en^0.01",
                  "publisherLocation_en^0.01",
                  "prefLabel_bo_x_ewts^1",
                  "prefLabel_en^1",
                  "comment_bo_x_ewts^0.0001",
                  "comment_en^0.0001",
                  "altLabel_bo_x_ewts^0.6",
                  "altLabel_en^0.6",
                ],
              },
            },
            {
              multi_match: {
                type: "phrase_prefix",
                query: query,
                fields: [
                  "seriesName_bo_x_ewts^0.1",
                  "seriesName_en^0.1",
                  "authorshipStatement_bo_x_ewts^0.005",
                  "authorshipStatement_en^0.005",
                  "publisherName_bo_x_ewts^0.01",
                  "publisherLocation_bo_x_ewts^0.01",
                  "publisherName_en^0.01",
                  "publisherLocation_en^0.01",
                  "prefLabel_bo_x_ewts^1",
                  "prefLabel_en^1",
                  "comment_bo_x_ewts^0.0001",
                  "comment_en^0.0001",
                  "altLabel_bo_x_ewts^0.6",
                  "altLabel_en^0.6",
                ],
              },
            },
          ],
        },
      },
    },
  };
};

const getDefaultQuery = (filter) => {
  return {
    bool: {
      filter: filter,
      must: {
        rank_feature: {
          field: "pop_score_rk",
        },
      },
    },
  };
};

const getCustomizedBdrcIndexRequest = (request) => {
  let clonedRequest = Object.assign({}, request);
  const userInput = request?.request?.params?.query || "";
  const userPage = request?.request?.params?.page || 0;
  const userHitsPerPage = request?.request?.params?.hitsPerPage || 20;
  const userFacetFilters = request?.request?.params?.facetFilters || [];
  const userFacets = request?.request?.params?.facets || [];
  const userMaxValuePerFacets =
    request?.request?.params?.maxValuesPerFacet || 20;

  // Queries
  const userQueryFacetFilters = forgeFacetFilters(userFacetFilters);
  const userAggregates = forgeUserAggregateFacets(
    userFacets,
    userMaxValuePerFacets
  );

  clonedRequest.body = {
    from: userPage * userHitsPerPage,
    size: userHitsPerPage,
    aggs: userAggregates,
    highlight: {
      fields: {
        prefLabel_bo_x_ewts: {},
        altLabel_bo_x_ewts: {},
        seriesName_bo_x_ewts: {},
        seriesName_en: {},
        content_en: {},
      },
    },
    query:
      userInput !== ""
        ? getCustomQuery(userInput, userQueryFacetFilters)
        : getDefaultQuery(userQueryFacetFilters),
  };

  return clonedRequest;
};

export { getCustomizedBdrcIndexRequest };
