import React from "react";

import { Highlight } from "react-instantsearch";

import { RESULT_FIELDS } from "../constants/fields";

const Hit = ({ hit, label }) => {
  return (
    <>
      <b>{label} : </b>
      <Highlight hit={hit} attribute={label} />
    </>
  );
};

const CustomHit = ({ hit }) => {
  // if (hit)
  // console.log(hit);

  return (
    <ul>
      {RESULT_FIELDS.map(
        (_field, _key) =>
          !!hit[_field.label] && (
            <li key={_key}>
              {_field.highlightable ? (
                <Hit hit={hit} label={_field.label} />
              ) : (
                <>
                  <b>{_field.label} : </b>
                  {hit[_field.label]}
                </>
              )}
            </li>
          )
      )}
    </ul>
  );

  // debugger;
  // return (
  //   <ul>
  //     {hit.objectID && <li>ID : {hit.objectID}</li>}
  //     {hit.language && (
  //       <li>
  //         <b>language : </b>
  //         <Highlight hit={hit} attribute="language" />
  //       </li>
  //     )}
  //     {hit.seriesName_bo_x_ewts && (
  //       <li>
  //         <b>seriesName_bo_x_ewts : </b>
  //         <Highlight hit={hit} attribute="seriesName_bo_x_ewts" />
  //       </li>
  //     )}
  //     {hit.seriesName_en && (
  //       <li>
  //         <b>seriesName_en : </b>
  //         <Highlight hit={hit} attribute="seriesName_en" />
  //       </li>
  //     )}
  //     {hit.authorshipStatement_bo_x_ewts && (
  //       <li>
  //         <b>authorshipStatement_bo_x_ewts : </b>
  //         <Highlight hit={hit} attribute="authorshipStatement_bo_x_ewts" />
  //       </li>
  //     )}
  //     {hit.authorshipStatement_en && (
  //       <li>
  //         <b>authorshipStatement_en : </b>{" "}
  //         <Highlight hit={hit} attribute="authorshipStatement_en" />
  //       </li>
  //     )}
  //     {hit.publisherName_bo_x_ewts && (
  //       <li>
  //         <b>publisherName_bo_x_ewts : </b>
  //         <Highlight hit={hit} attribute="publisherName_bo_x_ewts" />
  //       </li>
  //     )}
  //     {hit.publisherLocation_bo_x_ewts && (
  //       <li>
  //         <b>publisherLocation_bo_x_ewts : </b>
  //         <Highlight hit={hit} attribute="publisherLocation_bo_x_ewts" />
  //       </li>
  //     )}
  //     {hit.publisherName_en && (
  //       <li>
  //         <b>publisherName_en : </b>
  //         <Highlight hit={hit} attribute="publisherName_en" />
  //       </li>
  //     )}
  //     {hit.publisherLocation_en && (
  //       <li>
  //         <b>publisherLocation_en : </b>
  //         <Highlight hit={hit} attribute="publisherLocation_en" />
  //       </li>
  //     )}
  //     {hit.prefLabel_bo_x_ewts && (
  //       <li>
  //         <b>prefLabel_bo_x_ewts : </b>
  //         <Highlight hit={hit} attribute="prefLabel_bo_x_ewts" />
  //       </li>
  //     )}
  //     {hit.prefLabel_en && (
  //       <li>
  //         <b>prefLabel_en : </b>
  //         <Highlight hit={hit} attribute="prefLabel_en" />
  //       </li>
  //     )}
  //     {hit.comment_bo_x_ewts && (
  //       <li>
  //         <b>comment_bo_x_ewts : </b>
  //         <Highlight hit={hit} attribute="comment_bo_x_ewts" />
  //       </li>
  //     )}
  //     {hit.comment_en && (
  //       <li>
  //         <b>comment_en : </b> <Highlight hit={hit} attribute="comment_en" />
  //       </li>
  //     )}
  //     {hit.altLabel_bo_x_ewts && (
  //       <li>
  //         <b>altLabel_bo_x_ewts : </b>
  //         <Highlight hit={hit} attribute="altLabel_bo_x_ewts" />
  //       </li>
  //     )}
  //     {hit.altLabel_en && (
  //       <li>
  //         <b>altLabel_en : </b>
  //         <Highlight hit={hit} attribute="altLabel_en" />
  //       </li>
  //     )}

  //     {hit.author && (
  //       <li>
  //         <b>author : </b>
  //         <Highlight hit={hit} attribute="author" />
  //       </li>
  //     )}

  //     {hit.translator && (
  //       <li>
  //         <b>translator : </b>
  //         <Highlight hit={hit} attribute="translator" />
  //       </li>
  //     )}

  //     {hit.workGenre && (
  //       <li>
  //         <b>workGenre : </b>
  //         <Highlight hit={hit} attribute="workGenre" />
  //       </li>
  //     )}

  //     {hit.workIsAbout && (
  //       <li>
  //         <b>workIsAbout : </b>
  //         <Highlight hit={hit} attribute="workIsAbout" />
  //       </li>
  //     )}
  //     {/*
  //     {hit.author && (
  //       // hit.author.map((_author, _key) => (
  //       //   <React.Fragment key={_key}>
  //       //     {_author.prefLabel_bo_x_ewts && (
  //       //       <li>
  //       //         <b>author.prefLabel_bo_x_ewts : </b>
  //       //         <Highlight hit={hit} attribute="author.prefLabel_bo_x_ewts" />
  //       //       </li>
  //       //     )}
  //       //     {_author.prefLabel_en && (
  //       //       <li>
  //       //         <b>author.prefLabel_en : </b>
  //       //         <Highlight hit={hit} attribute="author.prefLabel_en" />
  //       //       </li>
  //       //     )}
  //       //   </React.Fragment>
  //       // ))
  //       <li>
  //         <b>AUTHOR.prefLabel_bo_x_ewts : </b>
  //         <Highlight hit={hit} attribute="author.prefLabel_bo_x_ewts" />
  //       </li>
  //     )}
  //     {hit.translator &&
  //       hit.translator.map((_translator, _key) => (
  //         <React.Fragment key={_key}>
  //           {console.log("hit", hit)}
  //           {_translator.prefLabel_bo_x_ewts && (
  //             <li>
  //               <b>translator.prefLabel_bo_x_ewts</b> :
  //               <Highlight
  //                 hit={hit}
  //                 attribute="translator.prefLabel_bo_x_ewts"
  //               />
  //             </li>
  //           )}
  //           {_translator.prefLabel_en && (
  //             <li>
  //               <b>translator.prefLabel_en</b> :
  //               <Highlight hit={hit} attribute="translator.prefLabel_en" />
  //             </li>
  //           )}
  //         </React.Fragment>
  //       ))}

  //     {hit.workGenre &&
  //       hit.workGenre.map((_workGenre, _key) => (
  //         <React.Fragment key={_key}>
  //           {_workGenre.prefLabel_bo_x_ewts && (
  //             <li>
  //               <b>workGenre.prefLabel_bo_x_ewts</b> :
  //               <Highlight
  //                 hit={hit}
  //                 attribute="workGenre.prefLabel_bo_x_ewts"
  //               />
  //             </li>
  //           )}
  //           {_workGenre.prefLabel_en && (
  //             <li>
  //               <b>workGenre.prefLabel_en</b> :
  //               <Highlight
  //                 hit={hit}
  //                 attribute={["workGenre", "prefLabel_en"]}
  //               />
  //             </li>
  //           )}
  //         </React.Fragment>
  //       ))}
  //     {hit.workIsAbout &&
  //       hit.workIsAbout.map((_workIsAbout, _key) => (
  //         <React.Fragment key={_key}>
  //           {_workIsAbout.prefLabel_bo_x_ewts && (
  //             <li>
  //               <b>workIsAbout.prefLabel_bo_x_ewts</b> :
  //               <MyHighlight
  //                 hit={_workIsAbout.prefLabel_bo_x_ewts[0]}
  //                 attribute="workIsAbout.prefLabel_bo_x_ewts"
  //               />
  //             </li>
  //           )}
  //           {_workIsAbout.prefLabel_en && (
  //             <li>
  //               <b>workIsAbout.prefLabel_en</b> :
  //               <Highlight
  //                 hit={hit}
  //                 attribute={`workIsAbout[${_key}].prefLabel_en`}
  //               />
  //             </li>
  //           )}
  //         </React.Fragment>
  //       ))} */}

  //     {/* )} */}
  //   </ul>
  // );
};

// const MyHighlight = ({ hit, value = "yul" }) => {
//   // console.log("hit", hit);
//   const highlightedValue = hit.replaceAll(
//     value,
//     `<mark class="ais-Highlight-highlighted">${value}</mark>`
//   );

//   return (
//     <span
//       className="ais-Highlight"
//       dangerouslySetInnerHTML={{ __html: highlightedValue }}
//     />
//   );
// };

export default CustomHit;
