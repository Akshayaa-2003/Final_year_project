// src/utils/crowdUtils.js - FIXED & ENHANCED BRO 🚀

const CROWD_KEYWORDS = [
  "crowd", "traffic", "jam", "rush", "busy", "queue", "waiting",
  "packed", "full", "chaos", "delay", "stuck", "slow"
];

function isCrowdPost(text) {
  const lowerText = text.toLowerCase();
  return CROWD_KEYWORDS.some(word => 
    lowerText.includes(word)
  );
}

function timeWeight(minutesAgo) {
  if (minutesAgo <= 10) return 4;   // Fresh = HIGH weight
  if (minutesAgo <= 20) return 3;
  if (minutesAgo <= 40) return 2;
  return 1;  // Old = LOW weight
}

function trendWeight(score) {
  if (score >= 80) return 35;       // Very popular = HIGH crowd
  if (score >= 60) return 25;
  if (score >= 40) return 15;
  return 8;                         // Low interest = LOW crowd
}

function calculatePostIntensity(posts) {
  // Bonus points for multiple crowd keywords
  let intensity = 0;
  posts.forEach(post => {
    const crowdMatches = CROWD_KEYWORDS.filter(word => 
      post.text.toLowerCase().includes(word)
    ).length;
    if (crowdMatches > 0) {
      intensity += timeWeight(post.minutesAgo) * (crowdMatches + 1);
    }
  });
  return Math.min(intensity, 25);  // Cap at 25 points
}

export function calculateFinalCrowd(posts = [], trendScore = 50) {
  let score = 0;

  // 1. Social media posts analysis (max 25 points)
  score += calculatePostIntensity(posts);

  // 2. Google Trends weight (max 35 points)
  score += trendWeight(trendScore);

  // 3. Time-of-day bonus (peak hours = +10 points)
  const hour = new Date().getHours();
  const isPeakHour = (hour >= 8 && hour <= 11) || (hour >= 17 && hour <= 20);
  if (isPeakHour) score += 10;

  // 4. Weekend bonus (weekends busier = +5 points)
  const isWeekend = [0, 6].includes(new Date().getDay());
  if (isWeekend) score += 5;

  console.log(`Crowd calc: Posts(${calculatePostIntensity(posts)}) + Trends(${trendWeight(trendScore)}) + Peak(${isPeakHour ? 10 : 0}) + Weekend(${isWeekend ? 5 : 0}) = ${score}`);

  // Final crowd level
  if (score < 25) return "low";
  if (score < 55) return "medium"; 
  return "high";
}

// NEW: Generate realistic mock posts based on time/location
export function generateMockPosts(location = "Chennai", minutes = 60) {
  const now = Date.now();
  const posts = [];
  
  // Base posts for location
  const basePosts = [
    `Heavy ${location === "Marina Beach" ? "crowd" : "traffic"} at ${location}`,
    `${location} is so busy today`,
    `Long queue at ${location}`,
    `Traffic jam near ${location}`
  ];

  // Generate 3-7 random recent posts
  const postCount = 3 + Math.floor(Math.random() * 5);
  for (let i = 0; i < postCount; i++) {
    const minutesAgo = Math.floor(Math.random() * minutes);
    posts.push({
      text: basePosts[Math.floor(Math.random() * basePosts.length)],
      minutesAgo: minutesAgo,
      timestamp: now - (minutesAgo * 60 * 1000)
    });
  }
  
  return posts;
}

// Test function
export function testCrowdCalculation() {
  const testPosts = generateMockPosts("Marina Beach");
  const testScore = 72;
  console.log("🧠 Test posts:", testPosts);
  console.log("📊 Crowd level:", calculateFinalCrowd(testPosts, testScore));
}
