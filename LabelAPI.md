Concerning the LabelAPI

This is an example of query :

```
POST /{resource}/
{
  ids: ["id1", "id2", "id3", "unknownId"] // Array of quering ids
  lang: "bo-x-ewts" // language
}

// Expected result
[
  {
    id: "id1",
    label: "label 1"
  },
  {
    id: "id2",
    label: "label 2"
  },
  {
    id: "id3",
    label: "label 3"
  }
]
```
