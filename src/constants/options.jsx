export const SelectTravelesList = [
    {
        id: 1,
        title: 'Its Just Me , Myself and I',
        desc: 'Solo Traveller',
        icon: '✈',
        people: 'Only 1',
    },
    {
        id: 2,
        title: 'Two’s Company, Three’s a Crowd',
        desc: 'Couple Traveller',
        icon: '❤️',
        people: '2 People',
    },
    {
        id: 3,
        title: 'The Family Circus',
        desc: 'Family Traveller',
        icon: '👨‍👩‍👧‍👦',
        people: '3 to 5 people'
    },

    {
        id: 4,
        title: 'The Adventure Squad',
        desc: 'Friends Traveller',
        icon: '👯‍♂️',
        people: '2 to 10 people'
    }

]

export const SelectBudgetOptions = [
    {
        id: 1,
        title: 'Cheap as Chips',
        desc: 'Instant noodles and happy memories!',
        icon: '💸',
    },
    {
        id: 2,
        title: 'Moderately Priced',
        desc: 'Adventure without too much splurge!',
        icon: '🛏️',
    },
    {
        id: 3,
        title: 'Luxury Living',
        desc: 'Travel like a celebrity, darling!',
        icon: '👑',
    },
];

export const AI_PROMPT = 'Generate Travel Plan For Location:{location}, for {totalDays} Days for {people} with a {budget} budget, give me hotel options list with rating and a best time to visit the places,with each day plan with best time to visit, give me the response in json format';