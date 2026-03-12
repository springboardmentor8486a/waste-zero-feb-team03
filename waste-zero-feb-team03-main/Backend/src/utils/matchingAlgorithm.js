// Composite score = 0.6 × skillScore + 0.4 × locationScore
const WEIGHTS = { skill: 0.6, location: 0.4 };
export const MIN_MATCH_THRESHOLD = 0.2;

const normalize = (str) => (str || '').toLowerCase().trim();

 // Returns 1.0 if there are no required skills (anyone qualifies).
export function calculateSkillScore(volunteerSkills = [], requiredSkills = []) {
  if (!requiredSkills.length) return 1;
  if (!volunteerSkills.length) return 0;

  const vSkills = volunteerSkills.map(normalize);
  const rSkills = requiredSkills.map(normalize);

  const matched = rSkills.filter((rs) =>
    vSkills.some((vs) => vs.includes(rs) || rs.includes(vs))
  );

  return matched.length / rSkills.length;
}

/**
  Location proximity:
   1.0 → exact match
   0.8 → one contains the other 
   0.5 → either location is unknown
   0.0 → no match
 */
export function calculateLocationScore(volunteerLocation = '', opportunityLocation = '') {
  const vLoc = normalize(volunteerLocation);
  const oLoc = normalize(opportunityLocation);

  if (!vLoc || !oLoc) return 0.5; // unknown → neutral
  if (vLoc === oLoc) return 1;
  if (vLoc.includes(oLoc) || oLoc.includes(vLoc)) return 0.8;

  // same first token (city name before comma)
  const vCity = vLoc.split(',')[0].trim();
  const oCity = oLoc.split(',')[0].trim();
  if (vCity && vCity === oCity) return 0.9;

  return 0;
}


// Composite match score for one volunteer–opportunity pair.
export function calculateMatchScore(volunteer, opportunity) {
  const skillScore = calculateSkillScore(volunteer.skills, opportunity.required_skills);
  const locationScore = calculateLocationScore(volunteer.location, opportunity.location);
  const score = parseFloat(
    (WEIGHTS.skill * skillScore + WEIGHTS.location * locationScore).toFixed(3)
  );

  return {
    score,
    skillScore: parseFloat(skillScore.toFixed(3)),
    locationScore: parseFloat(locationScore.toFixed(3)),
    isEligible: score >= MIN_MATCH_THRESHOLD,
  };
}


 // Rank open opportunities for a volunteer 
 
export function rankOpportunitiesForVolunteer(volunteer, opportunities) {
  return opportunities
    .filter((opp) => opp.status === 'open')
    .map((opp) => ({ opportunity: opp, ...calculateMatchScore(volunteer, opp) }))
    .filter((r) => r.isEligible)
    .sort((a, b) => b.score - a.score);
}


// Rank volunteers for an opportunity 

export function rankVolunteersForOpportunity(opportunity, volunteers) {
  return volunteers
    .map((vol) => ({ volunteer: vol, ...calculateMatchScore(vol, opportunity) }))
    .filter((r) => r.isEligible)
    .sort((a, b) => b.score - a.score);
}