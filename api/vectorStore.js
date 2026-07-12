/**
 * In-Memory Edge Vector DB for Stadium Knowledge Base
 * (RAG Retrieval-Augmented Generation context)
 * 
 * Since this runs on Vercel Edge functions, we use a lightweight keyword/cosine-similarity 
 * approximation over pre-chunked knowledge blocks.
 */

const STADIUM_KNOWLEDGE_BASE = [
  {
    id: "rules_prohibited",
    content: "Prohibited items at FIFA Arena 26 include: Large bags or backpacks (over 30x30cm), professional cameras, outside food or beverages, lasers, flares, and air horns.",
    tags: ["rules", "bags", "camera", "food", "prohibited", "allowed"]
  },
  {
    id: "facilities_washrooms",
    content: "Washrooms are located at every corner of the stadium. Zone A and B use the North-West washrooms. Zone C and D use the North-East washrooms. Zone E and F use the South-West washrooms. Zone G and H use the South-East washrooms.",
    tags: ["washroom", "toilet", "restroom", "facilities"]
  },
  {
    id: "facilities_food",
    content: "Food and beverage counters are located in the main concourse on Level 1 and Level 2. Vegan and Halal options are available at counter 4 (Zone C) and counter 9 (Zone G).",
    tags: ["food", "drink", "water", "hungry", "vegan", "halal", "concourse"]
  },
  {
    id: "parking_info",
    content: "Parking requires pre-booking. VIP parking is near Gate 1 (North). General parking is near Gate 4 (South). Shuttles run every 10 minutes from the metro station to the stadium.",
    tags: ["parking", "car", "vehicle", "metro", "transport"]
  },
  {
    id: "emergency_medical",
    content: "Medical rooms (First Aid) are located near Gate 2 and Gate 6. In case of a medical emergency, use the SOS button on the app to alert security, or find a volunteer in a green vest.",
    tags: ["medical", "doctor", "hurt", "first aid", "emergency", "sick", "bleed"]
  },
  {
    id: "emergency_evacuation",
    content: "During an evacuation, do not use elevators. Zone A and B evacuate via Gate 1. Zone C and D evacuate via Gate 2. Zone E and F evacuate via Gate 3. Zone G and H evacuate via Gate 4.",
    tags: ["evacuation", "exit", "emergency", "fire", "stampede", "run", "gate"]
  }
];

export function queryVectorDB(query, limit = 2) {
  const qTerms = query.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(' ');
  
  // Score each document based on term overlap
  const scoredDocs = STADIUM_KNOWLEDGE_BASE.map(doc => {
    let score = 0;
    const docText = doc.content.toLowerCase();
    
    qTerms.forEach(term => {
      if (term.length < 3) return;
      if (docText.includes(term)) score += 1;
      if (doc.tags.some(tag => tag.includes(term))) score += 2;
    });
    
    return { ...doc, score };
  });

  scoredDocs.sort((a, b) => b.score - a.score);
  
  const results = scoredDocs.filter(d => d.score > 0).slice(0, limit);
  
  if (results.length === 0) {
    return "No specific stadium context found for this query.";
  }
  
  return results.map(r => r.content).join("\n\n");
}
