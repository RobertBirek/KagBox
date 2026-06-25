// Polityka wyszukiwania zewnetrznego — domeny i tierowanie
// Dostosuj do swoich potrzeb

const SOURCE_TIERS = {
  official: [],
  partner: [],
  community: [],
  general: []
};

const classifySourceTier = (url) => {
  try {
    const u = new URL(url);
    const domain = u.hostname.toLowerCase();
    if (SOURCE_TIERS.official.some(d => domain.includes(d))) return 'official';
    if (SOURCE_TIERS.partner.some(d => domain.includes(d))) return 'partner';
    if (SOURCE_TIERS.community.some(d => domain.includes(d))) return 'community';
    return 'general';
  } catch { return 'general'; }
};

export { SOURCE_TIERS, classifySourceTier };
