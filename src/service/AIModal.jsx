import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
};

export const chatSession = model.startChat({
    generationConfig,
    history: [
        {
            role: "user",
            parts: [
                {
                    text: `
                    Generate a detailed travel plan for Location: Las Vegas for 3 days for a couple with a budget-friendly focus.
    
                    Provide a list of hotel options with the following details:
                    - hotelName, hotelAddress, price, hotelImageUrl, geoCoordinates, rating, description, bestTimeToVisit.
                    - Try to provide 4-5 hotels within the given budget range.
                    
                    Additionally, create an itinerary with day-wise plans, ensuring consistency across entries by including these details for each place:
                    - day, title, placeName, placeAddress, placeDetails, placeImageUrl, geoCoordinates, ticketPricing, rating, timeToTravel, bestTime, and timeRange (e.g., "09:00 AM - 11:00 AM").
                    
                    Ensure the following:
                    - Every day includes a morning, afternoon, and evening time slot with distinct activities.
                    - Each activity includes the 'placeAddress' field in the response, and the timeRange is provided as a specific time interval.
                    - 'placeAddress', 'timeToTravel', 'rating', and 'ticketPricing' fields have meaningful, non-empty values across all entries in the itinerary.
                    - Use the local currency for 'price' and 'ticketPricing' based on the location (e.g., USD for the United States, EUR for Europe).
                    
                    **Important: Calculate and include the field 'estimatedBudget' in the response.**
                    - To calculate 'estimatedBudget', estimate the total cost of the trip by:
                      - Averaging the nightly prices of the recommended hotels and multiplying by the number of nights.
                      - Summing up the ticket prices for each listed activity in the itinerary.
                    - The 'estimatedBudget' should be in the local currency of the specified location (e.g., USD for Las Vegas).
                    
                    Format the response in JSON.
                `

                },
            ],
        },
        {
            role: "model",
            parts: [
                {
                    text: "```json\n{\n  \"hotels\": [\n    {\n      \"hotelName\": \"The D Las Vegas\",\n      \"hotelAddress\": \"301 Fremont Street, Las Vegas, NV 89101\",\n      \"price\": \"$50 - $100 per night\",\n      \"hotelImageUrl\": \"https://www.the-d.com/sites/default/files/styles/hero_image/public/2023-06/the-d-las-vegas-hotel-casino-exterior-daytime.jpg?itok=VqG45s0k\",\n      \"geoCoordinates\": \"36.1699° N, 115.1426° W\",\n      \"rating\": 4.0,\n      \"description\": \"A budget-friendly hotel in downtown Las Vegas, known for its vibrant casino and lively atmosphere.\",\n      \"bestTimeToVisit\": \"Fall and Spring\"\n    }\n  ],\n  \"itinerary\": [\n    {\n      \"day\": 1,\n      \"title\": \"Exploring Downtown\",\n      \"plan\": [\n        {\n          \"placeName\": \"Las Vegas Natural History Museum\",\n          \"placeAddress\": \"900 Las Vegas Blvd N, Las Vegas, NV 89101\",\n          \"placeDetails\": \"Explore a variety of exhibits on dinosaurs, wildlife, and ancient civilizations.\",\n          \"placeImageUrl\": \"https://example.com/image1.jpg\",\n          \"geoCoordinates\": \"36.1750° N, 115.1372° W\",\n          \"ticketPricing\": \"$12\",\n          \"rating\": 4.4,\n          \"timeToTravel\": \"2 hours\",\n          \"bestTime\": \"Morning\",\n          \"timeRange\": \"09:00 AM - 11:00 AM\"\n        },\n        {\n          \"placeName\": \"Fremont Street Experience\",\n          \"placeAddress\": \"Fremont St, Las Vegas, NV 89101\",\n          \"placeDetails\": \"A lively pedestrian mall with LED canopy, street performers, and live music.\",\n          \"placeImageUrl\": \"https://example.com/image2.jpg\",\n          \"geoCoordinates\": \"36.1699° N, 115.1426° W\",\n          \"ticketPricing\": \"Free\",\n          \"rating\": 4.5,\n          \"timeToTravel\": \"2 hours\",\n          \"bestTime\": \"Afternoon\",\n          \"timeRange\": \"01:00 PM - 03:00 PM\"\n        },\n        {\n          \"placeName\": \"The Strip at Night\",\n          \"placeAddress\": \"Las Vegas Blvd, Las Vegas, NV 89109\",\n          \"placeDetails\": \"Iconic boulevard known for its neon lights, casinos, and vibrant nightlife.\",\n          \"placeImageUrl\": \"https://example.com/image3.jpg\",\n          \"geoCoordinates\": \"36.1147° N, 115.1728° W\",\n          \"ticketPricing\": \"Free\",\n          \"rating\": 4.8,\n          \"timeToTravel\": \"3 hours\",\n          \"bestTime\": \"Evening\",\n          \"timeRange\": \"07:00 PM - 10:00 PM\"\n        }\n      ]\n    }\n  ]\n}\n```"
                },
            ],
        },
    ],
});
