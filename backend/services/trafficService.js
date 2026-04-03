// backend/services/trafficService.js

// Mock traffic score — realistic simulation based on time + weather
function getTrafficScore(weatherScore) {
  const hour = new Date().getHours();

  // Rush hours
  const isRushHour = (hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 20);

  let base = 0.1;
  if (isRushHour) base = 0.4;

  // Bad weather compounds traffic
  if (weatherScore > 0.7) base = Math.min(base + 0.4, 1.0);
  else if (weatherScore > 0.4) base = Math.min(base + 0.2, 1.0);

  // Add small random variance to look real
  const variance = Math.random() * 0.1 - 0.05;
  return parseFloat(Math.min(Math.max(base + variance, 0), 1).toFixed(2));
}

module.exports = { getTrafficScore };
