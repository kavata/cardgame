export function getPenalites(numeroCarte) {
  let penalites = 1;

  if (numeroCarte % 10 === 0) {
    penalites = 3;
  } else if (numeroCarte % 5 === 0) {
    penalites = 2;
  } else if (numeroCarte % 11 === 0) {
    penalites = 5;
  }

  if (numeroCarte === 55) {
    penalites = 7;
  }

  return penalites;
}

// Exemple d'utilisation :
const numeroCarteExemple = 42; // Remplacez cela par le numéro de carte souhaité
const penalitesExemple = getPenalites(numeroCarteExemple);

console.log(`Le numéro ${numeroCarteExemple} a ${penalitesExemple} pénalité(s).`);
