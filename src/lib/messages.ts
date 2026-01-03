// Motivational quotes organized by progress level
// Popular quotes that resonate with goal achievement

export interface ProgressQuote {
  text: string;
  author: string;
}

// Quotes for just starting out (0-10%)
const startingQuotes: ProgressQuote[] = [
  { text: "The journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Begin anywhere.", author: "John Cage" },
  { text: "A year from now you may wish you had started today.", author: "Karen Lamb" },
  { text: "The beginning is always today.", author: "Mary Shelley" },
  { text: "Take the first step in faith. You don't have to see the whole staircase.", author: "Martin Luther King Jr." },
  { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
  { text: "Don't wait for the perfect moment. Take the moment and make it perfect.", author: "Zoey Sayward" },
  { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
  { text: "Every expert was once a beginner.", author: "Helen Hayes" },
  { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
  { text: "The first step toward success is taken when you refuse to be a captive of the environment.", author: "Mark Caine" },
  { text: "Don't be afraid to give up the good to go for the great.", author: "John D. Rockefeller" },
  { text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
  { text: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis" },
  { text: "The distance between your dreams and reality is called action.", author: "Unknown" },
  { text: "Stop being afraid of what could go wrong and think of what could go right.", author: "Unknown" },
  { text: "Today is the first day of the rest of your life.", author: "Charles Dederich" },
  { text: "What we fear doing most is usually what we most need to do.", author: "Tim Ferriss" },
  { text: "Inaction breeds doubt and fear. Action breeds confidence and courage.", author: "Dale Carnegie" },
  { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "If you want to lift yourself up, lift up someone else.", author: "Booker T. Washington" },
  { text: "Dream big and dare to fail.", author: "Norman Vaughan" },
];

// Quotes for early progress (11-25%)
const earlyProgressQuotes: ProgressQuote[] = [
  { text: "Small progress is still progress.", author: "Unknown" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "Every accomplishment starts with the decision to try.", author: "John F. Kennedy" },
  { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
  { text: "Great things are done by a series of small things brought together.", author: "Vincent Van Gogh" },
  { text: "Little by little, one travels far.", author: "J.R.R. Tolkien" },
  { text: "Success is the progressive realization of a worthy goal.", author: "Earl Nightingale" },
  { text: "Dripping water hollows out stone, not through force but through persistence.", author: "Ovid" },
  { text: "The man who moves a mountain begins by carrying away small stones.", author: "Confucius" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "You don't have to see the whole staircase, just take the first step.", author: "Martin Luther King Jr." },
  { text: "The elevator to success is out of order. You'll have to use the stairs.", author: "Joe Girard" },
  { text: "Progress is impossible without change.", author: "George Bernard Shaw" },
  { text: "Be not afraid of going slowly, be afraid only of standing still.", author: "Chinese Proverb" },
  { text: "The only way to achieve the impossible is to believe it is possible.", author: "Charles Kingsleigh" },
  { text: "Continuous improvement is better than delayed perfection.", author: "Mark Twain" },
  { text: "A little progress each day adds up to big results.", author: "Satya Nani" },
  { text: "Focus on the step in front of you, not the whole staircase.", author: "Unknown" },
  { text: "Rome wasn't built in a day, but they were laying bricks every hour.", author: "John Heywood" },
  { text: "The only person you should try to be better than is who you were yesterday.", author: "Unknown" },
  { text: "What seems impossible today will one day become your warm-up.", author: "Unknown" },
  { text: "Don't compare your beginning to someone else's middle.", author: "Jon Acuff" },
  { text: "Success is walking from failure to failure with no loss of enthusiasm.", author: "Winston Churchill" },
  { text: "Be patient with yourself. Self-growth is tender.", author: "Brianna Wiest" },
  { text: "You're making progress even when it doesn't feel like it.", author: "Unknown" },
];

// Quotes for building momentum (26-50%)
const momentumQuotes: ProgressQuote[] = [
  { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
  { text: "You're halfway there. Keep pushing.", author: "Unknown" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Unknown" },
  { text: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau" },
  { text: "The difference between ordinary and extraordinary is that little extra.", author: "Jimmy Johnson" },
  { text: "Motivation is what gets you started. Habit is what keeps you going.", author: "Jim Ryun" },
  { text: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke" },
  { text: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt" },
  { text: "I find that the harder I work, the more luck I seem to have.", author: "Thomas Jefferson" },
  { text: "Don't limit your challenges. Challenge your limits.", author: "Unknown" },
  { text: "Hustle until you no longer have to introduce yourself.", author: "Unknown" },
  { text: "The dream is free. The hustle is sold separately.", author: "Unknown" },
  { text: "What you do today can improve all your tomorrows.", author: "Ralph Marston" },
  { text: "Stay focused, go after your dreams and keep moving toward your goals.", author: "LL Cool J" },
  { text: "Energy and persistence conquer all things.", author: "Benjamin Franklin" },
  { text: "There are no shortcuts to any place worth going.", author: "Beverly Sills" },
  { text: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn" },
  { text: "Your limitation—it's only your imagination.", author: "Unknown" },
  { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
  { text: "Great things never come from comfort zones.", author: "Unknown" },
  { text: "The pain you feel today will be the strength you feel tomorrow.", author: "Unknown" },
  { text: "Success doesn't just find you. You have to go out and get it.", author: "Unknown" },
  { text: "Don't stop when you're tired. Stop when you're done.", author: "Unknown" },
  { text: "Wake up with determination. Go to bed with satisfaction.", author: "Unknown" },
  { text: "Work hard in silence, let your success be the noise.", author: "Frank Ocean" },
  { text: "The middle of every successful project looks like a disaster.", author: "Rosabeth Moss Kanter" },
  { text: "If it doesn't challenge you, it doesn't change you.", author: "Fred DeVito" },
  { text: "You're doing amazing. Trust the process.", author: "Unknown" },
  { text: "Keep going. Everything you need will come to you at the perfect time.", author: "Unknown" },
];

// Quotes for strong progress (51-75%)
const strongProgressQuotes: ProgressQuote[] = [
  { text: "You're doing better than you think.", author: "Unknown" },
  { text: "The finish line is in sight. Don't stop now.", author: "Unknown" },
  { text: "Perseverance is not a long race; it's many short races one after the other.", author: "Walter Elliot" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "You are stronger than you think.", author: "Unknown" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Believe in yourself and all that you are.", author: "Christian D. Larson" },
  { text: "You've come too far to quit now.", author: "Unknown" },
  { text: "The road to success is always under construction.", author: "Lily Tomlin" },
  { text: "Success is not how high you have climbed, but how you make a positive difference.", author: "Roy T. Bennett" },
  { text: "Don't be discouraged. It's often the last key in the bunch that opens the lock.", author: "Unknown" },
  { text: "Winners are not people who never fail but people who never quit.", author: "Unknown" },
  { text: "The struggle you're in today is developing the strength you need for tomorrow.", author: "Robert Tew" },
  { text: "You're not almost there. You ARE there—just finishing up.", author: "Unknown" },
  { text: "Success is liking yourself, liking what you do, and liking how you do it.", author: "Maya Angelou" },
  { text: "The harder the battle, the sweeter the victory.", author: "Les Brown" },
  { text: "Champions keep playing until they get it right.", author: "Billie Jean King" },
  { text: "I never dreamed about success. I worked for it.", author: "Estée Lauder" },
  { text: "Strength does not come from winning. Your struggles develop your strengths.", author: "Arnold Schwarzenegger" },
  { text: "You didn't come this far to only come this far.", author: "Unknown" },
  { text: "Stay patient and trust your journey.", author: "Unknown" },
  { text: "When you feel like quitting, think about why you started.", author: "Unknown" },
  { text: "Success is getting what you want. Happiness is wanting what you get.", author: "Dale Carnegie" },
  { text: "The best view comes after the hardest climb.", author: "Unknown" },
  { text: "Your only limit is your mind.", author: "Unknown" },
  { text: "Don't tell people your plans. Show them your results.", author: "Unknown" },
  { text: "One day or day one. You decide.", author: "Unknown" },
  { text: "Be so good they can't ignore you.", author: "Steve Martin" },
  { text: "Success is stumbling from failure to failure with no loss of enthusiasm.", author: "Winston Churchill" },
];

// Quotes for almost there (76-99%)
const almostThereQuotes: ProgressQuote[] = [
  { text: "You're so close. Finish strong!", author: "Unknown" },
  { text: "The last 10% is always the hardest. You've got this.", author: "Unknown" },
  { text: "Don't give up now. The beginning is always the hardest.", author: "Unknown" },
  { text: "Victory is sweetest when you've known defeat.", author: "Malcolm Forbes" },
  { text: "Almost there. Keep your eye on the prize.", author: "Unknown" },
  { text: "Finish what you started. Future you will thank you.", author: "Unknown" },
  { text: "The only thing standing between you and your goal is the story you keep telling yourself.", author: "Jordan Belfort" },
  { text: "You're in the home stretch. Don't look back now.", author: "Unknown" },
  { text: "Persistence guarantees that results are inevitable.", author: "Paramahansa Yogananda" },
  { text: "The final stretch is where champions are made.", author: "Unknown" },
  { text: "You're not tired, you're almost there.", author: "Unknown" },
  { text: "Never give up on something that you can't go a day without thinking about.", author: "Winston Churchill" },
  { text: "It's always darkest before the dawn.", author: "Thomas Fuller" },
  { text: "The only failure is not finishing.", author: "Unknown" },
  { text: "Pain is temporary. Quitting lasts forever.", author: "Lance Armstrong" },
  { text: "Go the extra mile. It's never crowded.", author: "Wayne Dyer" },
  { text: "You are so close you can taste it.", author: "Unknown" },
  { text: "The end is just the beginning of something better.", author: "Unknown" },
  { text: "Don't stop until you're proud.", author: "Unknown" },
  { text: "The difference between who you are and who you want to be is what you do.", author: "Unknown" },
  { text: "You've survived 100% of your worst days. You'll survive this too.", author: "Unknown" },
  { text: "Almost is not the same as done. Finish it.", author: "Unknown" },
  { text: "The world makes way for the person who knows where they're going.", author: "Ralph Waldo Emerson" },
  { text: "Success is the result of perfection, hard work, and learning from failure.", author: "Colin Powell" },
  { text: "You're not almost done—you're about to prove everyone wrong.", author: "Unknown" },
  { text: "Finish lines are just the beginning of a new race.", author: "Unknown" },
  { text: "The trophy is within reach. Grab it.", author: "Unknown" },
  { text: "Champions finish what they start.", author: "Unknown" },
  { text: "Keep going. Your future self is counting on you.", author: "Unknown" },
  { text: "This is where ordinary becomes extraordinary.", author: "Unknown" },
];

// Quotes for completion (100%)
const completionQuotes: ProgressQuote[] = [
  { text: "You did it! Success is the best revenge.", author: "Frank Sinatra" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "What you get by achieving your goals is not as important as what you become.", author: "Zig Ziglar" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "Success is not the key to happiness. Happiness is the key to success.", author: "Albert Schweitzer" },
  { text: "You proved them wrong. You proved yourself right.", author: "Unknown" },
  { text: "Victory belongs to the most persevering.", author: "Napoleon Bonaparte" },
  { text: "The reward of a thing well done is having done it.", author: "Ralph Waldo Emerson" },
  { text: "There is no substitute for hard work.", author: "Thomas Edison" },
  { text: "Celebrate what you've accomplished, but raise the bar a little higher each time.", author: "Mia Hamm" },
  { text: "You are capable of amazing things.", author: "Unknown" },
  { text: "From small beginnings come great things.", author: "Proverb" },
  { text: "Be proud of how hard you've worked.", author: "Unknown" },
  { text: "Success is a journey, not a destination.", author: "Ben Sweetland" },
  { text: "The difference between the impossible and the possible lies in determination.", author: "Tommy Lasorda" },
  { text: "You just proved that you can do anything you set your mind to.", author: "Unknown" },
  { text: "Achievement is largely the product of steadily raising one's level of aspiration.", author: "Jack Nicklaus" },
  { text: "Every champion was once a contender that refused to give up.", author: "Rocky Balboa" },
  { text: "Success isn't given. It's earned.", author: "Unknown" },
  { text: "You've done what most people only dream about.", author: "Unknown" },
  { text: "Now you know: you're unstoppable.", author: "Unknown" },
  { text: "This is just the beginning of your next chapter.", author: "Unknown" },
  { text: "Remember this feeling. You earned it.", author: "Unknown" },
  { text: "Excellence is not a singular act, but a habit.", author: "Aristotle" },
  { text: "What's next? The world is yours.", author: "Unknown" },
];

// Quotes for when someone hasn't updated in a while (encouragement)
const comebackQuotes: ProgressQuote[] = [
  { text: "It's not about how hard you hit. It's about how hard you can get hit and keep moving forward.", author: "Rocky Balboa" },
  { text: "Fall seven times, stand up eight.", author: "Japanese Proverb" },
  { text: "Your only limit is you.", author: "Unknown" },
  { text: "The comeback is always stronger than the setback.", author: "Unknown" },
  { text: "Never confuse a single defeat with a final defeat.", author: "F. Scott Fitzgerald" },
  { text: "You haven't come this far to only come this far.", author: "Unknown" },
  { text: "It's okay to start over. This time you're not starting from scratch, you're starting from experience.", author: "Unknown" },
  { text: "Every day is a new beginning. Take a deep breath and start again.", author: "Unknown" },
  { text: "The only bad workout is the one that didn't happen.", author: "Unknown" },
  { text: "Failure is not the opposite of success—it's part of success.", author: "Arianna Huffington" },
  { text: "Don't let yesterday take up too much of today.", author: "Will Rogers" },
  { text: "Mistakes are proof that you are trying.", author: "Unknown" },
  { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", author: "Nelson Mandela" },
  { text: "Rock bottom became the solid foundation on which I rebuilt my life.", author: "J.K. Rowling" },
  { text: "Sometimes the wrong choices bring us to the right places.", author: "Unknown" },
  { text: "You are allowed to be both a masterpiece and a work in progress.", author: "Sophia Bush" },
  { text: "Don't look back. You're not going that way.", author: "Unknown" },
  { text: "Every setback is a setup for a comeback.", author: "Unknown" },
  { text: "Your past does not define your future.", author: "Unknown" },
  { text: "Start where you are, not where you think you should be.", author: "Unknown" },
  { text: "Progress, not perfection.", author: "Unknown" },
  { text: "A smooth sea never made a skilled sailor.", author: "Franklin D. Roosevelt" },
  { text: "What feels like the end is often the beginning.", author: "Unknown" },
  { text: "You're still here. That's what matters.", author: "Unknown" },
  { text: "The only time you fail is when you fall down and stay down.", author: "Stephen Richards" },
  { text: "Life is 10% what happens to you and 90% how you react to it.", author: "Charles R. Swindoll" },
  { text: "Today is your day to start fresh, to eat right, to train hard, to live healthy.", author: "Bonnie Pfiester" },
  { text: "Never give up on a dream just because of the time it will take to accomplish it.", author: "Earl Nightingale" },
  { text: "You are not your mistakes.", author: "Unknown" },
  { text: "Pick yourself up, dust yourself off, and start again.", author: "Frank Sinatra" },
];

// General inspirational quotes (used when overall progress is mixed)
const generalQuotes: ProgressQuote[] = [
  { text: "The best time for new beginnings is now.", author: "Unknown" },
  { text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
  { text: "The purpose of our lives is to be happy.", author: "Dalai Lama" },
  { text: "Get busy living or get busy dying.", author: "Stephen King" },
  { text: "You only live once, but if you do it right, once is enough.", author: "Mae West" },
  { text: "Many of life's failures are people who did not realize how close they were to success.", author: "Thomas Edison" },
  { text: "If you want to live a happy life, tie it to a goal, not to people or things.", author: "Albert Einstein" },
  { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
  { text: "Life is really simple, but we insist on making it complicated.", author: "Confucius" },
  { text: "The only real mistake is the one from which we learn nothing.", author: "Henry Ford" },
  { text: "In three words I can sum up everything I've learned about life: it goes on.", author: "Robert Frost" },
  { text: "Life is trying things to see if they work.", author: "Ray Bradbury" },
  { text: "The biggest risk is not taking any risk.", author: "Mark Zuckerberg" },
  { text: "Go confidently in the direction of your dreams.", author: "Henry David Thoreau" },
  { text: "Whether you think you can or you think you can't, you're right.", author: "Henry Ford" },
  { text: "The mind is everything. What you think you become.", author: "Buddha" },
  { text: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein" },
  { text: "Two roads diverged in a wood, and I took the one less traveled by.", author: "Robert Frost" },
  { text: "Everything you can imagine is real.", author: "Pablo Picasso" },
  { text: "Do what you love and the money will follow.", author: "Marsha Sinetar" },
  { text: "Happiness is not something ready-made. It comes from your own actions.", author: "Dalai Lama" },
  { text: "If opportunity doesn't knock, build a door.", author: "Milton Berle" },
  { text: "The only person you are destined to become is the person you decide to be.", author: "Ralph Waldo Emerson" },
  { text: "I have not failed. I've just found 10,000 ways that won't work.", author: "Thomas Edison" },
  { text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson" },
  { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
  { text: "Life shrinks or expands in proportion to one's courage.", author: "Anaïs Nin" },
  { text: "You must be the change you wish to see in the world.", author: "Mahatma Gandhi" },
];

function getRandomQuote(quotes: ProgressQuote[]): ProgressQuote {
  return quotes[Math.floor(Math.random() * quotes.length)];
}

export function getMotivationalQuote(progress: number, daysSinceUpdate?: number): ProgressQuote {
  // If it's been a while since an update, show comeback quotes
  if (daysSinceUpdate && daysSinceUpdate > 7 && progress < 100) {
    return getRandomQuote(comebackQuotes);
  }

  // Mix in general quotes occasionally (20% chance)
  if (Math.random() < 0.2) {
    return getRandomQuote(generalQuotes);
  }

  if (progress === 100) {
    return getRandomQuote(completionQuotes);
  } else if (progress >= 76) {
    return getRandomQuote(almostThereQuotes);
  } else if (progress >= 51) {
    return getRandomQuote(strongProgressQuotes);
  } else if (progress >= 26) {
    return getRandomQuote(momentumQuotes);
  } else if (progress >= 11) {
    return getRandomQuote(earlyProgressQuotes);
  } else {
    return getRandomQuote(startingQuotes);
  }
}

// Get a stable quote based on resolution ID (so it doesn't change on every render)
export function getStableQuote(resolutionId: string, progress: number): ProgressQuote {
  const progressBracket = progress === 100 ? 5 : Math.floor(progress / 20);

  const quoteSets = [
    startingQuotes,
    earlyProgressQuotes,
    momentumQuotes,
    strongProgressQuotes,
    almostThereQuotes,
    completionQuotes,
  ];

  const quotes = quoteSets[Math.min(progressBracket, quoteSets.length - 1)];

  // Use resolution ID to deterministically pick a quote
  let hash = 0;
  for (let i = 0; i < resolutionId.length; i++) {
    hash = ((hash << 5) - hash) + resolutionId.charCodeAt(i);
    hash = hash & hash;
  }

  const index = Math.abs(hash) % quotes.length;
  return quotes[index];
}

// Get all quotes for a category (useful for debugging or showing all)
export function getAllQuotes(): { category: string; quotes: ProgressQuote[] }[] {
  return [
    { category: 'Starting (0-10%)', quotes: startingQuotes },
    { category: 'Early Progress (11-25%)', quotes: earlyProgressQuotes },
    { category: 'Building Momentum (26-50%)', quotes: momentumQuotes },
    { category: 'Strong Progress (51-75%)', quotes: strongProgressQuotes },
    { category: 'Almost There (76-99%)', quotes: almostThereQuotes },
    { category: 'Completed (100%)', quotes: completionQuotes },
    { category: 'Comeback', quotes: comebackQuotes },
    { category: 'General', quotes: generalQuotes },
  ];
}

// Total quote count
export function getTotalQuoteCount(): number {
  return startingQuotes.length +
         earlyProgressQuotes.length +
         momentumQuotes.length +
         strongProgressQuotes.length +
         almostThereQuotes.length +
         completionQuotes.length +
         comebackQuotes.length +
         generalQuotes.length;
}
