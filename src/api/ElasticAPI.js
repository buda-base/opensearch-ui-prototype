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
    query: {
      bool: {
        filter: userQueryFacetFilters,
        must: [
          {
            multi_match: {
              type: "phrase",
              query: userInput,
              fields: [
                "seriesName_bo_x_ewts^2",
                "seriesName_en^2",
                "authorshipStatement_bo_x_ewts",
                "authorshipStatement_en",
                "publisherName_bo_x_ewts",
                "publisherLocation_bo_x_ewts",
                "publisherName_en",
                "publisherLocation_en",
                "prefLabel_bo_x_ewts^5",
                "prefLabel_en^5",
                "comment_bo_x_ewts",
                "comment_en",
                "altLabel_bo_x_ewts^4",
                "altLabel_en^4",
              ],
            },
          },
          {
            multi_match: {
              type: "phrase_prefix",
              query: userInput,
              fields: [
                "seriesName_bo_x_ewts^2",
                "seriesName_en^2",
                "authorshipStatement_bo_x_ewts",
                "authorshipStatement_en",
                "publisherName_bo_x_ewts",
                "publisherLocation_bo_x_ewts",
                "publisherName_en",
                "publisherLocation_en",
                "prefLabel_bo_x_ewts^5",
                "prefLabel_en^5",
                "comment_bo_x_ewts",
                "comment_en",
                "altLabel_bo_x_ewts^4",
                "altLabel_en^4",
              ],
            },
          },
        ],
      },
    },
  };

  return clonedRequest;
};

export { getCustomizedBdrcIndexRequest };
