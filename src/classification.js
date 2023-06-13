import React from 'react'

let categories = [
  {
   name: 'A – General Works'
  },
  {
   name: 'B(i) – Philosophy'
  },
  {
   name: 'B(ii) – Psychology'
  },
  {
   name: 'B(iii) – Religion'
  },
  {
   name: 'C – Auxiliary Sciences-'
  },
  {
   name: 'of History'
  },
  {
    name: 'D – World History'
  },
  {
    name: 'E – History of Kenya'
  },
  {
    name: 'F – Local History of Africa'
  },
  {
    name: 'G(i) – Geography'
  },
  {
    name: 'G(ii) – Anthropology'
  },
  {
    name: 'G(iii) – Recreation'
  },
  {
    name: 'H – Social Sciences'
  },
  {
    name: 'J – Political Science'
  },
  {
    name: 'K – Law'
  },
  {
    name: 'L – Education'
  },
  {
    name: 'M – Music'
  },
  {
     name: 'N – Fine Arts'
  },
  {
     name: 'P – Language & Literature'
  },
  {
     name: 'Q – Science'
  },
  {
     name: 'R – Medicine'
  },
  {
     name: 'S – Agriculture'
  },
  {
     name: 'T – Technology'
  },
  {
     name: 'U – Military Science'
  },
  {
     name: 'V – Naval Science'
  },
  {
     name: 'Z(i) – Bibliography'
  },
  {
     name: 'Z(ii) – Library Science'
  }
];

let filterbyarray = [
  {
   name: 'Title',
   dbref: 'title'
  },
  {
    name: 'Author',
    dbref: 'author'
  },
  {
    name: 'Category',
    dbref: 'category'
  }
];

let covertypesarray = [
  {
   name: 'Hard Cover',
  },
  {
    name: 'Soft Cover'
  },
  {
    name: 'Magazines',
  },
  { 
  name: 'Scripts/ Other',
  },
  { 
  name: 'Photo Albums',
  },
  {
    name: 'Audio',
  },
  {
    name: 'Video',
  }
];

export function getFilterBy() {
  return filterbyarray;
}

export function getCategories() {
  return categories;
}

export function getCoverTypes() {
  return covertypesarray;
}