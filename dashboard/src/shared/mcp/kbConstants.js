const ALL_KB_NAMESPACES = [
  'MojaPierwszaBaza'
];

const kbGroup = (namespace, kbs) => {
  if (!namespace) return 'Inne';
  return 'Moje bazy';
};

const KB_GROUPS = {
  'Moje bazy': ['MojaPierwszaBaza']
};

export { ALL_KB_NAMESPACES, kbGroup, KB_GROUPS };
