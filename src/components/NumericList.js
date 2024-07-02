// Core
import React, { useEffect, useState } from "react";

// hooks
import { useNumericMenu } from "react-instantsearch";

// API
import { fetchLabels } from "../api/LabelAPI";

const LANGUAGE = "bo-x-ewts";

const getItem = (collection, id) => {
  return collection.find((_item) => _item.id === id);
};

function CustomNumericList(props) {
  const { attribute } = props;

  const {
    items,
    refine
  } = useNumericMenu(props);

  return (
    <div className="ais-RefinementList">
      {/* <input
        type="search"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        maxLength={512}
        onChange={(event) => searchForItems(event.currentTarget.value)}
      /> */}
      <ul className="ais-RefinementList-list">
        {items.map((item) => (
          <li
            key={item.label}
            className={`ais-RefinementList-item ${
              item.isRefined && "ais-RefinementList-item--selected"
            }`}
          >
            <label className="ais-RefinementList-label">
              <input
                type="checkbox"
                className="ais-RefinementList-checkbox"
                checked={item.isRefined}
                onChange={() => refine(item.value)}
              />
              <span className="ais-RefinementList-labelText">
                {/*getItem(currentItems, item.value)?.label ||*/ item.label}
              </span>
              <span className="ais-RefinementList-count">{item.count}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CustomNumericList;
