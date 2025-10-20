// src/utils/gameLogic/quizData.js
import { shuffleArray } from '../helpers';

// Enhanced quiz questions database with 200 questions
export const QUIZ_QUESTIONS = {
  easy: [
    {
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      answer: "Paris",
      category: "Geography",
      explanation: "Paris is the capital and most populous city of France, known as the City of Light."
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      answer: "Mars",
      category: "Science",
      explanation: "Mars appears red due to iron oxide (rust) on its surface and is the fourth planet from the Sun."
    },
    {
      question: "What is 2 + 2?",
      options: ["3", "4", "5", "6"],
      answer: "4",
      category: "Math",
      explanation: "Basic arithmetic: 2 + 2 = 4. This is one of the fundamental addition facts."
    },
    {
      question: "Who painted the Mona Lisa?",
      options: ["Van Gogh", "Picasso", "Da Vinci", "Monet"],
      answer: "Da Vinci",
      category: "Art",
      explanation: "Leonardo da Vinci painted the Mona Lisa in the 16th century during the Renaissance period."
    },
    {
      question: "What is the largest ocean on Earth?",
      options: ["Atlantic", "Indian", "Arctic", "Pacific"],
      answer: "Pacific",
      category: "Geography",
      explanation: "The Pacific Ocean covers about 63 million square miles and is larger than all land areas combined."
    },
    {
      question: "How many continents are there?",
      options: ["5", "6", "7", "8"],
      answer: "7",
      category: "Geography",
      explanation: "The seven continents are: Asia, Africa, North America, South America, Antarctica, Europe, and Australia."
    },
    {
      question: "What is the color of a ripe banana?",
      options: ["Red", "Blue", "Yellow", "Green"],
      answer: "Yellow",
      category: "General",
      explanation: "Ripe bananas are yellow due to the breakdown of chlorophyll and production of carotenoids."
    },
    {
      question: "Which animal is known as the 'King of the Jungle'?",
      options: ["Elephant", "Lion", "Tiger", "Gorilla"],
      answer: "Lion",
      category: "Science",
      explanation: "Lions are often called the King of the Jungle due to their majestic appearance and position at the top of the food chain."
    },
    {
      question: "What is the largest land animal?",
      options: ["Elephant", "Giraffe", "Hippo", "Rhino"],
      answer: "Elephant",
      category: "Science",
      explanation: "African elephants are the largest land animals, weighing up to 6,000 kg (13,000 lb)."
    },
    {
      question: "Which month has the fewest days?",
      options: ["January", "February", "April", "November"],
      answer: "February",
      category: "General",
      explanation: "February has 28 days in common years and 29 in leap years, making it the shortest month."
    },
    {
      question: "What is 5 × 6?",
      options: ["25", "30", "35", "40"],
      answer: "30",
      category: "Math",
      explanation: "5 multiplied by 6 equals 30. This is part of the 5 times table in multiplication."
    },
    {
      question: "Which is the smallest planet in our solar system?",
      options: ["Mars", "Venus", "Mercury", "Pluto"],
      answer: "Mercury",
      category: "Science",
      explanation: "Mercury is the smallest and innermost planet in the Solar System, with a diameter of about 4,880 km."
    },
    {
      question: "How many sides does a triangle have?",
      options: ["2", "3", "4", "5"],
      answer: "3",
      category: "Math",
      explanation: "A triangle is a polygon with three edges and three vertices. The sum of its interior angles is 180 degrees."
    },
    {
      question: "What do bees collect from flowers?",
      options: ["Water", "Nectar", "Leaves", "Seeds"],
      answer: "Nectar",
      category: "Science",
      explanation: "Bees collect nectar from flowers to make honey, which serves as their food source."
    },
    {
      question: "Which season comes after winter?",
      options: ["Spring", "Summer", "Autumn", "Monsoon"],
      answer: "Spring",
      category: "General",
      explanation: "The four seasons in order are: Winter, Spring, Summer, and Autumn (Fall)."
    },
    {
      question: "What is 10 - 4?",
      options: ["5", "6", "7", "8"],
      answer: "6",
      category: "Math",
      explanation: "10 minus 4 equals 6. This is basic subtraction."
    },
    {
      question: "Which color is an emerald?",
      options: ["Red", "Blue", "Green", "Yellow"],
      answer: "Green",
      category: "General",
      explanation: "Emeralds are precious gemstones known for their rich green color, which comes from chromium and vanadium."
    },
    {
      question: "How many hours are in a day?",
      options: ["12", "24", "36", "48"],
      answer: "24",
      category: "General",
      explanation: "There are 24 hours in a day, which is the time it takes Earth to complete one rotation on its axis."
    },
    {
      question: "What is the capital of Italy?",
      options: ["Paris", "Madrid", "Rome", "Berlin"],
      answer: "Rome",
      category: "Geography",
      explanation: "Rome is the capital city of Italy and was the center of the ancient Roman Empire."
    },
    {
      question: "Which animal says 'moo'?",
      options: ["Dog", "Cat", "Cow", "Sheep"],
      answer: "Cow",
      category: "General",
      explanation: "Cows make a 'moo' sound, which is one of the most recognizable animal sounds."
    },
    {
      question: "What do you use to write on paper?",
      options: ["Spoon", "Pen", "Knife", "Hammer"],
      answer: "Pen",
      category: "General",
      explanation: "Pens are writing instruments used to apply ink to surfaces, typically paper."
    },
    {
      question: "How many days are in a week?",
      options: ["5", "6", "7", "8"],
      answer: "7",
      category: "General",
      explanation: "There are 7 days in a week: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, and Sunday."
    },
    {
      question: "What is the color of snow?",
      options: ["Black", "Blue", "White", "Green"],
      answer: "White",
      category: "General",
      explanation: "Snow appears white because it reflects all visible wavelengths of light equally."
    },
    {
      question: "Which fruit is yellow and curved?",
      options: ["Apple", "Orange", "Banana", "Grape"],
      answer: "Banana",
      category: "General",
      explanation: "Bananas are typically yellow when ripe and have a characteristic curved shape."
    },
    {
      question: "What is 3 × 4?",
      options: ["7", "12", "15", "20"],
      answer: "12",
      category: "Math",
      explanation: "3 multiplied by 4 equals 12. This is part of the basic multiplication table."
    },
    {
      question: "Which is the largest big cat?",
      options: ["Leopard", "Lion", "Tiger", "Cheetah"],
      answer: "Tiger",
      category: "Science",
      explanation: "Tigers are the largest wild cats in the world, with Siberian tigers being the biggest subspecies."
    },
    {
      question: "What is the opposite of 'hot'?",
      options: ["Warm", "Cold", "Cool", "Freezing"],
      answer: "Cold",
      category: "General",
      explanation: "Cold is the direct opposite of hot in terms of temperature."
    },
    {
      question: "How many legs does a spider have?",
      options: ["6", "8", "10", "12"],
      answer: "8",
      category: "Science",
      explanation: "Spiders are arachnids, which have eight legs, unlike insects that have six."
    },
    {
      question: "What is the capital of Japan?",
      options: ["Beijing", "Seoul", "Tokyo", "Bangkok"],
      answer: "Tokyo",
      category: "Geography",
      explanation: "Tokyo is the capital and most populous city of Japan, located on the island of Honshu."
    },
    {
      question: "Which planet is known for its rings?",
      options: ["Mars", "Jupiter", "Saturn", "Neptune"],
      answer: "Saturn",
      category: "Science",
      explanation: "Saturn has the most extensive and visible ring system of any planet in our solar system."
    },
    {
      question: "What is 15 ÷ 3?",
      options: ["3", "4", "5", "6"],
      answer: "5",
      category: "Math",
      explanation: "15 divided by 3 equals 5. Division is the inverse operation of multiplication."
    },
    {
      question: "Which bird can't fly but can swim?",
      options: ["Eagle", "Penguin", "Sparrow", "Ostrich"],
      answer: "Penguin",
      category: "Science",
      explanation: "Penguins are flightless birds that are excellent swimmers, using their wings as flippers."
    },
    {
      question: "What is the main language spoken in Brazil?",
      options: ["Spanish", "Portuguese", "English", "French"],
      answer: "Portuguese",
      category: "Geography",
      explanation: "Brazil is the only Portuguese-speaking country in South America due to its colonial history."
    },
    {
      question: "How many cents are in a dollar?",
      options: ["10", "50", "100", "1000"],
      answer: "100",
      category: "General",
      explanation: "There are 100 cents in one US dollar, which is the basic unit of currency in the United States."
    },
    {
      question: "What is the color of a school bus?",
      options: ["Red", "Blue", "Yellow", "Green"],
      answer: "Yellow",
      category: "General",
      explanation: "School buses are typically yellow because this color is highly visible and attracts attention easily."
    },
    {
      question: "Which month comes after June?",
      options: ["May", "July", "August", "September"],
      answer: "July",
      category: "General",
      explanation: "The months in order are: January, February, March, April, May, June, July, August, September, October, November, December."
    },
    {
      question: "What is 9 + 7?",
      options: ["15", "16", "17", "18"],
      answer: "16",
      category: "Math",
      explanation: "9 plus 7 equals 16. This is basic addition."
    },
    {
      question: "Which animal has a trunk?",
      options: ["Giraffe", "Elephant", "Rhino", "Hippo"],
      answer: "Elephant",
      category: "Science",
      explanation: "Elephants have long trunks that they use for breathing, smelling, drinking, and grasping objects."
    },
    {
      question: "What is the capital of Canada?",
      options: ["Toronto", "Vancouver", "Ottawa", "Montreal"],
      answer: "Ottawa",
      category: "Geography",
      explanation: "Ottawa was chosen as the capital of Canada in 1857 by Queen Victoria and is located in Ontario."
    }
  ],
  medium: [
    {
      question: "What is the chemical symbol for gold?",
      options: ["Go", "Gd", "Au", "Ag"],
      answer: "Au",
      category: "Science",
      explanation: "Au comes from the Latin word for gold, 'aurum'. Gold is a precious metal used in jewelry and electronics."
    },
    {
      question: "Which language has the most native speakers?",
      options: ["English", "Spanish", "Hindi", "Mandarin"],
      answer: "Mandarin",
      category: "General",
      explanation: "Mandarin Chinese has over 900 million native speakers, making it the most spoken language in the world."
    },
    {
      question: "In which year did World War II end?",
      options: ["1943", "1945", "1947", "1950"],
      answer: "1945",
      category: "History",
      explanation: "World War II ended in 1945 with the surrender of Germany in May and Japan in September."
    },
    {
      question: "What is the largest mammal in the world?",
      options: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
      answer: "Blue Whale",
      category: "Science",
      explanation: "Blue whales can reach up to 100 feet in length and 200 tons in weight, making them the largest animals ever known."
    },
    {
      question: "Who wrote 'Romeo and Juliet'?",
      options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
      answer: "William Shakespeare",
      category: "Literature",
      explanation: "Shakespeare wrote this famous tragedy in the late 16th century about two young star-crossed lovers."
    },
    {
      question: "What is the hardest natural substance on Earth?",
      options: ["Gold", "Iron", "Diamond", "Platinum"],
      answer: "Diamond",
      category: "Science",
      explanation: "Diamond is the hardest known natural material on the Mohs scale, with a rating of 10."
    },
    {
      question: "Which country is known as the Land of the Rising Sun?",
      options: ["China", "Thailand", "Japan", "South Korea"],
      answer: "Japan",
      category: "Geography",
      explanation: "Japan is called the Land of the Rising Sun because it lies to the east of the Asian mainland, where the sun appears to rise."
    },
    {
      question: "How many bones are in the human body?",
      options: ["186", "206", "226", "246"],
      answer: "206",
      category: "Science",
      explanation: "An adult human has 206 bones, while babies have about 300 that fuse together as they grow."
    },
    {
      question: "What is the capital of Australia?",
      options: ["Sydney", "Melbourne", "Canberra", "Perth"],
      answer: "Canberra",
      category: "Geography",
      explanation: "Canberra was purpose-built as the capital of Australia in 1908 as a compromise between Sydney and Melbourne."
    },
    {
      question: "Which planet is closest to the Sun?",
      options: ["Venus", "Mars", "Mercury", "Earth"],
      answer: "Mercury",
      category: "Science",
      explanation: "Mercury is the closest planet to the Sun in our solar system, with an average distance of about 36 million miles."
    },
    {
      question: "What is the square root of 64?",
      options: ["6", "7", "8", "9"],
      answer: "8",
      category: "Math",
      explanation: "8 multiplied by 8 equals 64, so the square root of 64 is 8."
    },
    {
      question: "Which element has the chemical symbol 'O'?",
      options: ["Gold", "Oxygen", "Osmium", "Oganesson"],
      answer: "Oxygen",
      category: "Science",
      explanation: "Oxygen is essential for most life forms and makes up about 21% of Earth's atmosphere."
    },
    {
      question: "Who discovered America in 1492?",
      options: ["Vasco da Gama", "Christopher Columbus", "Ferdinand Magellan", "Marco Polo"],
      answer: "Christopher Columbus",
      category: "History",
      explanation: "Christopher Columbus made four voyages across the Atlantic Ocean, opening the way for European exploration."
    },
    {
      question: "What is the main ingredient in guacamole?",
      options: ["Tomato", "Avocado", "Pepper", "Onion"],
      answer: "Avocado",
      category: "General",
      explanation: "Guacamole is a traditional Mexican dip made primarily from mashed avocados with various seasonings."
    },
    {
      question: "Which organ pumps blood throughout the body?",
      options: ["Liver", "Heart", "Lungs", "Brain"],
      answer: "Heart",
      category: "Science",
      explanation: "The heart is a muscular organ that circulates blood through the blood vessels by repeated rhythmic contractions."
    },
    {
      question: "What is the capital of Brazil?",
      options: ["Rio de Janeiro", "São Paulo", "Brasília", "Salvador"],
      answer: "Brasília",
      category: "Geography",
      explanation: "Brasília became the capital of Brazil in 1960, replacing Rio de Janeiro, and is known for its modernist architecture."
    },
    {
      question: "Which planet is known for its rings?",
      options: ["Jupiter", "Saturn", "Uranus", "Neptune"],
      answer: "Saturn",
      category: "Science",
      explanation: "Saturn has the most prominent ring system of any planet, composed mainly of ice particles with some rock debris."
    },
    {
      question: "What is the chemical symbol for silver?",
      options: ["Si", "Sv", "Ag", "Au"],
      answer: "Ag",
      category: "Science",
      explanation: "Ag comes from the Latin word for silver, 'argentum'. Silver is a precious metal with high electrical conductivity."
    },
    {
      question: "Who wrote 'The Odyssey'?",
      options: ["Virgil", "Homer", "Sophocles", "Plato"],
      answer: "Homer",
      category: "Literature",
      explanation: "Homer is the legendary author of both 'The Iliad' and 'The Odyssey', two epic poems of ancient Greece."
    },
    {
      question: "What is the largest island in the world?",
      options: ["Australia", "Greenland", "Borneo", "Madagascar"],
      answer: "Greenland",
      category: "Geography",
      explanation: "Greenland is the world's largest island, covering about 2.16 million square kilometers (836,000 sq mi)."
    },
    {
      question: "Which gas do plants absorb from the atmosphere?",
      options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
      answer: "Carbon Dioxide",
      category: "Science",
      explanation: "Plants absorb carbon dioxide during photosynthesis to produce glucose and oxygen."
    },
    {
      question: "What is the capital of Egypt?",
      options: ["Alexandria", "Cairo", "Luxor", "Giza"],
      answer: "Cairo",
      category: "Geography",
      explanation: "Cairo is the capital of Egypt and the largest city in the Arab world, located near the Nile Delta."
    },
    {
      question: "Who painted 'The Last Supper'?",
      options: ["Michelangelo", "Raphael", "Leonardo da Vinci", "Caravaggio"],
      answer: "Leonardo da Vinci",
      category: "Art",
      explanation: "Leonardo da Vinci painted 'The Last Supper' in the late 15th century, depicting Jesus and his disciples."
    },
    {
      question: "What is the smallest country in the world?",
      options: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"],
      answer: "Vatican City",
      category: "Geography",
      explanation: "Vatican City is an independent city-state enclaved within Rome, Italy, with an area of just 0.17 square miles."
    },
    {
      question: "Which element is essential for combustion?",
      options: ["Nitrogen", "Oxygen", "Carbon Dioxide", "Helium"],
      answer: "Oxygen",
      category: "Science",
      explanation: "Oxygen supports combustion, which is why fires need oxygen to burn. This is called an oxidizing agent."
    },
    {
      question: "What is the capital of Russia?",
      options: ["St. Petersburg", "Moscow", "Kiev", "Warsaw"],
      answer: "Moscow",
      category: "Geography",
      explanation: "Moscow is the capital and most populous city of Russia, located on the Moskva River in western Russia."
    },
    {
      question: "Who invented the telephone?",
      options: ["Thomas Edison", "Alexander Graham Bell", "Nikola Tesla", "Guglielmo Marconi"],
      answer: "Alexander Graham Bell",
      category: "Science",
      explanation: "Alexander Graham Bell was awarded the first U.S. patent for the telephone in 1876."
    },
    {
      question: "What is the main component of the Sun?",
      options: ["Oxygen", "Helium", "Hydrogen", "Carbon"],
      answer: "Hydrogen",
      category: "Science",
      explanation: "The Sun is primarily composed of hydrogen (about 74%) and helium (about 24%), with trace amounts of other elements."
    },
    {
      question: "Which ocean is the smallest?",
      options: ["Atlantic", "Indian", "Arctic", "Southern"],
      answer: "Arctic",
      category: "Geography",
      explanation: "The Arctic Ocean is the smallest and shallowest of the world's five major oceans."
    },
    {
      question: "What is the chemical formula for water?",
      options: ["CO2", "H2O", "O2", "NaCl"],
      answer: "H2O",
      category: "Science",
      explanation: "Water is composed of two hydrogen atoms bonded to one oxygen atom, giving it the chemical formula H2O."
    },
    {
      question: "Who wrote 'Hamlet'?",
      options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
      answer: "William Shakespeare",
      category: "Literature",
      explanation: "William Shakespeare wrote 'Hamlet' around 1599-1601, one of his most famous tragedies."
    },
    {
      question: "What is the capital of South Africa?",
      options: ["Johannesburg", "Cape Town", "Pretoria", "Durban"],
      answer: "Pretoria",
      category: "Geography",
      explanation: "South Africa has three capital cities: Pretoria (administrative), Cape Town (legislative), and Bloemfontein (judicial)."
    },
    {
      question: "Which planet is known as the Evening Star?",
      options: ["Mars", "Jupiter", "Venus", "Mercury"],
      answer: "Venus",
      category: "Science",
      explanation: "Venus is often called the Evening Star or Morning Star because it's visible near sunrise or sunset."
    },
    {
      question: "What is the largest desert in Africa?",
      options: ["Kalahari", "Sahara", "Namib", "Libyan"],
      answer: "Sahara",
      category: "Geography",
      explanation: "The Sahara Desert is the largest hot desert in the world, covering most of North Africa."
    },
    {
      question: "Who discovered gravity?",
      options: ["Albert Einstein", "Isaac Newton", "Galileo Galilei", "Nikola Tesla"],
      answer: "Isaac Newton",
      category: "Science",
      explanation: "Isaac Newton formulated the law of universal gravitation in the 17th century after observing an apple fall from a tree."
    },
    {
      question: "What is the capital of China?",
      options: ["Shanghai", "Beijing", "Hong Kong", "Guangzhou"],
      answer: "Beijing",
      category: "Geography",
      explanation: "Beijing is the capital of the People's Republic of China and has been the political center of China for centuries."
    },
    {
      question: "Which gas makes up most of Earth's atmosphere?",
      options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Argon"],
      answer: "Nitrogen",
      category: "Science",
      explanation: "Nitrogen makes up about 78% of Earth's atmosphere, while oxygen accounts for about 21%."
    },
    {
      question: "What is the longest river in the world?",
      options: ["Amazon", "Nile", "Yangtze", "Mississippi"],
      answer: "Nile",
      category: "Geography",
      explanation: "The Nile River in Africa is traditionally considered the longest river in the world at about 6,650 km (4,130 mi)."
    },
    {
      question: "Who painted the Sistine Chapel ceiling?",
      options: ["Leonardo da Vinci", "Raphael", "Michelangelo", "Donatello"],
      answer: "Michelangelo",
      category: "Art",
      explanation: "Michelangelo painted the Sistine Chapel ceiling between 1508 and 1512, including the famous 'Creation of Adam'."
    },
    {
      question: "What is the chemical symbol for iron?",
      options: ["Ir", "Fe", "In", "Au"],
      answer: "Fe",
      category: "Science",
      explanation: "Fe comes from the Latin word for iron, 'ferrum'. Iron is the most common element on Earth by mass."
    },
    {
      question: "Which country has the most population?",
      options: ["India", "United States", "China", "Indonesia"],
      answer: "China",
      category: "Geography",
      explanation: "China has the world's largest population with over 1.4 billion people, though India is close behind."
    }
  ],
  hard: [
    {
      question: "What is the speed of light in vacuum?",
      options: ["299,792 km/s", "150,000 km/s", "450,000 km/s", "1,000,000 km/s"],
      answer: "299,792 km/s",
      category: "Science",
      explanation: "The speed of light in vacuum is exactly 299,792,458 meters per second, a fundamental constant in physics."
    },
    {
      question: "Which element has the atomic number 1?",
      options: ["Oxygen", "Hydrogen", "Helium", "Carbon"],
      answer: "Hydrogen",
      category: "Science",
      explanation: "Hydrogen is the lightest and most abundant element in the universe, with atomic number 1."
    },
    {
      question: "What is the capital of Azerbaijan?",
      options: ["Baku", "Ankara", "Tbilisi", "Yerevan"],
      answer: "Baku",
      category: "Geography",
      explanation: "Baku is the capital and largest city of Azerbaijan, located on the Caspian Sea."
    },
    {
      question: "Who discovered penicillin?",
      options: ["Marie Curie", "Alexander Fleming", "Louis Pasteur", "Robert Koch"],
      answer: "Alexander Fleming",
      category: "Science",
      explanation: "Alexander Fleming discovered penicillin in 1928, revolutionizing medicine by introducing antibiotics."
    },
    {
      question: "What is the largest desert in the world?",
      options: ["Sahara", "Gobi", "Arabian", "Antarctic"],
      answer: "Antarctic",
      category: "Geography",
      explanation: "The Antarctic Desert is the largest desert in the world by area, covering about 14 million square kilometers."
    },
    {
      question: "In which year did the Titanic sink?",
      options: ["1910", "1912", "1914", "1916"],
      answer: "1912",
      category: "History",
      explanation: "The RMS Titanic sank on April 15, 1912, after hitting an iceberg on its maiden voyage from Southampton to New York."
    },
    {
      question: "What is the square root of 144?",
      options: ["11", "12", "13", "14"],
      answer: "12",
      category: "Math",
      explanation: "12 multiplied by 12 equals 144, so the square root of 144 is 12."
    },
    {
      question: "Which composer went deaf in his later years?",
      options: ["Mozart", "Bach", "Beethoven", "Chopin"],
      answer: "Beethoven",
      category: "Music",
      explanation: "Ludwig van Beethoven began losing his hearing in his late 20s and was almost completely deaf by his last years, yet continued composing."
    },
    {
      question: "What is the chemical formula for table salt?",
      options: ["NaCl", "KCl", "CaCl2", "MgCl2"],
      answer: "NaCl",
      category: "Science",
      explanation: "Table salt is sodium chloride, composed of sodium (Na) and chlorine (Cl) ions in a 1:1 ratio."
    },
    {
      question: "Which country has the most time zones?",
      options: ["USA", "China", "Russia", "Canada"],
      answer: "France",
      category: "Geography",
      explanation: "France has 12 time zones due to its overseas territories spread across the world, from the Caribbean to the Pacific."
    },
    {
      question: "What is the atomic number of carbon?",
      options: ["6", "7", "8", "9"],
      answer: "6",
      category: "Science",
      explanation: "Carbon has 6 protons in its nucleus, giving it atomic number 6. It's the basis for all organic life."
    },
    {
      question: "Who wrote '1984'?",
      options: ["Aldous Huxley", "George Orwell", "Ray Bradbury", "H.G. Wells"],
      answer: "George Orwell",
      category: "Literature",
      explanation: "George Orwell published '1984' in 1949 as a dystopian social science fiction novel about totalitarian control."
    },
    {
      question: "What is the smallest country in the world?",
      options: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"],
      answer: "Vatican City",
      category: "Geography",
      explanation: "Vatican City is only 0.17 square miles (0.44 square kilometers) in area, making it the world's smallest independent state."
    },
    {
      question: "Which planet has the most moons?",
      options: ["Jupiter", "Saturn", "Uranus", "Neptune"],
      answer: "Saturn",
      category: "Science",
      explanation: "Saturn has over 80 confirmed moons, with more being discovered regularly through advanced observations."
    },
    {
      question: "What is the capital of Canada?",
      options: ["Toronto", "Vancouver", "Ottawa", "Montreal"],
      answer: "Ottawa",
      category: "Geography",
      explanation: "Ottawa was chosen as the capital of Canada in 1857 by Queen Victoria as a compromise between English and French interests."
    },
    {
      question: "What is the chemical symbol for silver?",
      options: ["Si", "Sv", "Ag", "Au"],
      answer: "Ag",
      category: "Science",
      explanation: "Ag comes from the Latin word for silver, 'argentum'. Silver has the highest electrical conductivity of any element."
    },
    {
      question: "Who wrote 'The Odyssey'?",
      options: ["Virgil", "Homer", "Sophocles", "Plato"],
      answer: "Homer",
      category: "Literature",
      explanation: "Homer is the legendary author of 'The Odyssey', an epic poem about Odysseus' journey home after the Trojan War."
    },
    {
      question: "What is the Heisenberg Uncertainty Principle about?",
      options: ["Position and momentum", "Time and energy", "Mass and velocity", "Charge and spin"],
      answer: "Position and momentum",
      category: "Science",
      explanation: "The Heisenberg Uncertainty Principle states that the more precisely the position of a particle is known, the less precisely its momentum can be known, and vice versa."
    },
    {
      question: "In which year was the Berlin Wall demolished?",
      options: ["1987", "1989", "1991", "1993"],
      answer: "1989",
      category: "History",
      explanation: "The Berlin Wall was opened on November 9, 1989, leading to German reunification and symbolizing the end of the Cold War."
    },
    {
      question: "What is the capital of Argentina?",
      options: ["Buenos Aires", "Santiago", "Lima", "Montevideo"],
      answer: "Buenos Aires",
      category: "Geography",
      explanation: "Buenos Aires is the capital and largest city of Argentina, known for its European-style architecture and vibrant culture."
    },
    {
      question: "Who developed the polio vaccine?",
      options: ["Louis Pasteur", "Alexander Fleming", "Jonas Salk", "Robert Koch"],
      answer: "Jonas Salk",
      category: "Science",
      explanation: "Jonas Salk developed the first successful polio vaccine in 1955, which nearly eradicated the disease worldwide."
    },
    {
      question: "What is the molecular formula of benzene?",
      options: ["C6H6", "C6H12", "C7H8", "C8H10"],
      answer: "C6H6",
      category: "Science",
      explanation: "Benzene has the molecular formula C6H6 and features a hexagonal ring structure with alternating double bonds."
    },
    {
      question: "Which ancient civilization built Machu Picchu?",
      options: ["Aztec", "Maya", "Inca", "Olmec"],
      answer: "Inca",
      category: "History",
      explanation: "The Inca civilization built Machu Picchu in the 15th century as an estate for emperor Pachacuti."
    },
    {
      question: "What is the boiling point of water in Fahrenheit?",
      options: ["100°F", "180°F", "212°F", "32°F"],
      answer: "212°F",
      category: "Science",
      explanation: "Water boils at 212°F (100°C) at standard atmospheric pressure at sea level."
    },
    {
      question: "Who wrote 'War and Peace'?",
      options: ["Fyodor Dostoevsky", "Leo Tolstoy", "Anton Chekhov", "Vladimir Nabokov"],
      answer: "Leo Tolstoy",
      category: "Literature",
      explanation: "Leo Tolstoy wrote 'War and Peace' between 1865 and 1869, chronicling French invasion of Russia and its impact on society."
    },
    {
      question: "What is the capital of Turkey?",
      options: ["Istanbul", "Ankara", "Izmir", "Antalya"],
      answer: "Ankara",
      category: "Geography",
      explanation: "Ankara became the capital of Turkey in 1923, replacing Istanbul, as part of Mustafa Kemal Atatürk's modernization reforms."
    },
    {
      question: "Which element is liquid at room temperature?",
      options: ["Bromine", "Chlorine", "Iodine", "Fluorine"],
      answer: "Bromine",
      category: "Science",
      explanation: "Bromine is one of only two elements that are liquid at room temperature, the other being mercury."
    },
    {
      question: "Who was the first woman to win a Nobel Prize?",
      options: ["Marie Curie", "Rosalind Franklin", "Dorothy Hodgkin", "Maria Goeppert-Mayer"],
      answer: "Marie Curie",
      category: "Science",
      explanation: "Marie Curie won the Nobel Prize in Physics in 1903 (shared) and in Chemistry in 1911, making her the first woman Nobel laureate."
    },
    {
      question: "What is the largest moon in our solar system?",
      options: ["Titan", "Ganymede", "Moon", "Europa"],
      answer: "Ganymede",
      category: "Science",
      explanation: "Ganymede, a moon of Jupiter, is the largest moon in our solar system, even larger than the planet Mercury."
    },
    {
      question: "Which country has the longest coastline?",
      options: ["Russia", "Canada", "Indonesia", "Australia"],
      answer: "Canada",
      category: "Geography",
      explanation: "Canada has the world's longest coastline at 202,080 kilometers (125,567 miles), bordering three oceans."
    },
    {
      question: "What is the chemical symbol for potassium?",
      options: ["P", "Po", "K", "Pt"],
      answer: "K",
      category: "Science",
      explanation: "K comes from the Latin word for potassium, 'kalium'. Potassium is essential for nerve function and fluid balance in the body."
    },
    {
      question: "Who painted 'Girl with a Pearl Earring'?",
      options: ["Rembrandt", "Vermeer", "Van Gogh", "Monet"],
      answer: "Vermeer",
      category: "Art",
      explanation: "Johannes Vermeer painted 'Girl with a Pearl Earring' around 1665, often called the 'Mona Lisa of the North'."
    },
    {
      question: "What is the deepest point in the ocean?",
      options: ["Puerto Rico Trench", "Java Trench", "Mariana Trench", "Tonga Trench"],
      answer: "Mariana Trench",
      category: "Geography",
      explanation: "The Mariana Trench in the Pacific Ocean reaches a depth of about 36,000 feet (11,000 meters) at Challenger Deep."
    },
    {
      question: "Which planet has the shortest day?",
      options: ["Mercury", "Venus", "Jupiter", "Mars"],
      answer: "Jupiter",
      category: "Science",
      explanation: "Jupiter has the shortest day of all planets, completing one rotation in about 9 hours and 56 minutes."
    },
    {
      question: "Who wrote 'The Divine Comedy'?",
      options: ["Dante Alighieri", "Giovanni Boccaccio", "Francesco Petrarca", "Niccolò Machiavelli"],
      answer: "Dante Alighieri",
      category: "Literature",
      explanation: "Dante Alighieri wrote 'The Divine Comedy' between 1308 and 1320, describing his journey through Hell, Purgatory, and Paradise."
    },
    {
      question: "What is the capital of Mongolia?",
      options: ["Ulaanbaatar", "Astana", "Bishkek", "Dushanbe"],
      answer: "Ulaanbaatar",
      category: "Geography",
      explanation: "Ulaanbaatar is the capital and largest city of Mongolia, with almost half of the country's population living there."
    },
    {
      question: "Which element has the highest melting point?",
      options: ["Tungsten", "Carbon", "Osmium", "Rhenium"],
      answer: "Carbon",
      category: "Science",
      explanation: "Carbon (as graphite) sublimates at about 3900 K, higher than tungsten's melting point of 3695 K."
    },
    {
      question: "Who discovered X-rays?",
      options: ["Marie Curie", "Wilhelm Röntgen", "J.J. Thomson", "Ernest Rutherford"],
      answer: "Wilhelm Röntgen",
      category: "Science",
      explanation: "Wilhelm Röntgen discovered X-rays in 1895 and won the first Nobel Prize in Physics in 1901 for this discovery."
    }
  ],
  extreme: [
    {
      question: "What is the approximate value of the mathematical constant e?",
      options: ["2.71828", "3.14159", "1.61803", "0.57721"],
      answer: "2.71828",
      category: "Math",
      explanation: "Euler's number (e) is approximately 2.71828 and is the base of natural logarithms. It's fundamental in calculus and complex analysis."
    },
    {
      question: "Which philosopher said 'I think, therefore I am'?",
      options: ["Plato", "Aristotle", "Descartes", "Kant"],
      answer: "Descartes",
      category: "Philosophy",
      explanation: "René Descartes coined this phrase in his work 'Discourse on the Method' as a fundamental element of his philosophy."
    },
    {
      question: "What is the smallest bone in the human body?",
      options: ["Stapes", "Incus", "Malleus", "Cochlea"],
      answer: "Stapes",
      category: "Science",
      explanation: "The stapes bone in the middle ear is the smallest bone in the human body, measuring about 3 × 2.5 mm."
    },
    {
      question: "In which year was the first iPhone released?",
      options: ["2005", "2007", "2009", "2010"],
      answer: "2007",
      category: "Technology",
      explanation: "Steve Jobs announced the first iPhone on January 9, 2007, and it went on sale on June 29, 2007."
    },
    {
      question: "What is the chemical formula for ammonia?",
      options: ["NH3", "NH4", "NO2", "CH4"],
      answer: "NH3",
      category: "Science",
      explanation: "Ammonia is a compound of nitrogen and hydrogen with the formula NH3. It's widely used in fertilizers and cleaning products."
    },
    {
      question: "What is the capital of Bhutan?",
      options: ["Kathmandu", "Thimphu", "Dhaka", "Colombo"],
      answer: "Thimphu",
      category: "Geography",
      explanation: "Thimphu is the capital and largest city of Bhutan, located in the western central part of the country."
    },
    {
      question: "Which element has the highest melting point?",
      options: ["Tungsten", "Carbon", "Osmium", "Rhenium"],
      answer: "Carbon",
      category: "Science",
      explanation: "Carbon (as graphite) sublimates at about 3900 K, higher than tungsten's melting point of 3695 K."
    },
    {
      question: "Who developed the theory of relativity?",
      options: ["Newton", "Einstein", "Hawking", "Galileo"],
      answer: "Einstein",
      category: "Science",
      explanation: "Albert Einstein published his special theory of relativity in 1905 and general relativity in 1915, revolutionizing physics."
    },
    {
      question: "What is the largest prime number less than 100?",
      options: ["89", "91", "97", "99"],
      answer: "97",
      category: "Math",
      explanation: "97 is the largest prime number below 100. Prime numbers are only divisible by 1 and themselves."
    },
    {
      question: "What is the SI unit of electric current?",
      options: ["Volt", "Ampere", "Ohm", "Watt"],
      answer: "Ampere",
      category: "Science",
      explanation: "The ampere is the SI base unit for electric current, named after French physicist André-Marie Ampère."
    },
    {
      question: "Who painted 'The Starry Night'?",
      options: ["Picasso", "Monet", "Van Gogh", "Rembrandt"],
      answer: "Van Gogh",
      category: "Art",
      explanation: "Vincent van Gogh painted 'The Starry Night' in 1889 while in an asylum at Saint-Rémy-de-Provence."
    },
    {
      question: "What is the speed of sound in dry air at 20°C?",
      options: ["331 m/s", "343 m/s", "299 m/s", "320 m/s"],
      answer: "343 m/s",
      category: "Science",
      explanation: "The speed of sound in dry air at 20°C is approximately 343 meters per second (1,125 ft/s)."
    },
    {
      question: "Which ancient wonder was located in Alexandria?",
      options: ["Hanging Gardens", "Great Pyramid", "Lighthouse", "Colossus"],
      answer: "Lighthouse",
      category: "History",
      explanation: "The Lighthouse of Alexandria was one of the Seven Wonders of the Ancient World, standing over 100 meters tall."
    },
    {
      question: "What is the molecular formula of glucose?",
      options: ["C6H12O6", "C12H22O11", "C2H5OH", "CH3COOH"],
      answer: "C6H12O6",
      category: "Science",
      explanation: "Glucose is a simple sugar with the molecular formula C6H12O6. It's the primary source of energy for living organisms."
    },
    {
      question: "Who wrote 'The Republic'?",
      options: ["Aristotle", "Socrates", "Plato", "Confucius"],
      answer: "Plato",
      category: "Philosophy",
      explanation: "Plato wrote 'The Republic' around 375 BCE, discussing justice, the character of the just city-state, and the just man."
    },
    {
      question: "What is the Heisenberg Uncertainty Principle about?",
      options: ["Position and momentum", "Time and energy", "Mass and velocity", "Charge and spin"],
      answer: "Position and momentum",
      category: "Science",
      explanation: "The Heisenberg Uncertainty Principle is a fundamental concept in quantum mechanics stating that certain pairs of physical properties cannot be simultaneously known to arbitrary precision."
    },
    {
      question: "In which year was the Berlin Wall demolished?",
      options: ["1987", "1989", "1991", "1993"],
      answer: "1989",
      category: "History",
      explanation: "The Berlin Wall fell on November 9, 1989, after 28 years of dividing East and West Berlin during the Cold War."
    },
    {
      question: "What is the capital of Burkina Faso?",
      options: ["Bamako", "Ouagadougou", "Niamey", "Accra"],
      answer: "Ouagadougou",
      category: "Geography",
      explanation: "Ouagadougou is the capital and largest city of Burkina Faso, serving as the cultural, economic, and administrative center."
    },
    {
      question: "Who proved Fermat's Last Theorem?",
      options: ["Andrew Wiles", "Terence Tao", "Grigori Perelman", "John Nash"],
      answer: "Andrew Wiles",
      category: "Math",
      explanation: "Andrew Wiles proved Fermat's Last Theorem in 1994 after 358 years of the problem remaining unsolved."
    },
    {
      question: "What is the chemical symbol for tungsten?",
      options: ["Tn", "Tu", "W", "Tg"],
      answer: "W",
      category: "Science",
      explanation: "W comes from the German name for tungsten, 'Wolfram'. Tungsten has the highest melting point of all metals."
    },
    {
      question: "Who composed 'The Four Seasons'?",
      options: ["Mozart", "Vivaldi", "Bach", "Handel"],
      answer: "Vivaldi",
      category: "Music",
      explanation: "Antonio Vivaldi composed 'The Four Seasons' in 1723, a set of four violin concertos that represent each season."
    },
    {
      question: "What is the approximate value of the golden ratio?",
      options: ["1.41421", "1.61803", "2.71828", "3.14159"],
      answer: "1.61803",
      category: "Math",
      explanation: "The golden ratio (φ) is approximately 1.61803 and appears frequently in mathematics, art, architecture, and nature."
    },
    {
      question: "Which element is named after Alfred Nobel?",
      options: ["Nobelium", "Curium", "Einsteinium", "Fermium"],
      answer: "Nobelium",
      category: "Science",
      explanation: "Nobelium (atomic number 102) is named after Alfred Nobel, the founder of the Nobel Prize."
    },
    {
      question: "Who wrote 'One Hundred Years of Solitude'?",
      options: ["Pablo Neruda", "Gabriel García Márquez", "Jorge Luis Borges", "Isabel Allende"],
      answer: "Gabriel García Márquez",
      category: "Literature",
      explanation: "Gabriel García Márquez wrote 'One Hundred Years of Solitude' in 1967, a landmark of magical realism."
    },
    {
      question: "What is the capital of Kazakhstan?",
      options: ["Almaty", "Astana", "Bishkek", "Tashkent"],
      answer: "Astana",
      category: "Geography",
      explanation: "Astana became the capital of Kazakhstan in 1997, replacing Almaty. It was renamed Nur-Sultan in 2019 but changed back to Astana in 2022."
    },
    {
      question: "Which particle is known as the 'God particle'?",
      options: ["Electron", "Higgs boson", "Neutrino", "Quark"],
      answer: "Higgs boson",
      category: "Science",
      explanation: "The Higgs boson is often called the 'God particle' because it helps explain why other particles have mass."
    },
    {
      question: "Who developed the first computer algorithm?",
      options: ["Alan Turing", "Charles Babbage", "Ada Lovelace", "John von Neumann"],
      answer: "Ada Lovelace",
      category: "Technology",
      explanation: "Ada Lovelace wrote the first algorithm intended for Charles Babbage's Analytical Engine in the 1840s."
    },
    {
      question: "What is the chemical formula for ozone?",
      options: ["O2", "O3", "CO2", "NO2"],
      answer: "O3",
      category: "Science",
      explanation: "Ozone is a molecule composed of three oxygen atoms (O3) and forms a protective layer in the Earth's stratosphere."
    },
    {
      question: "Which mathematician developed non-Euclidean geometry?",
      options: ["Euclid", "Bernhard Riemann", "Carl Gauss", "Nikolai Lobachevsky"],
      answer: "Nikolai Lobachevsky",
      category: "Math",
      explanation: "Nikolai Lobachevsky developed hyperbolic geometry in the 1820s, the first complete non-Euclidean geometry."
    },
    {
      question: "What is the capital of Eritrea?",
      options: ["Addis Ababa", "Asmara", "Khartoum", "Djibouti"],
      answer: "Asmara",
      category: "Geography",
      explanation: "Asmara is the capital and most populous city of Eritrea, known for its well-preserved Italian modernist architecture."
    },
    {
      question: "Who discovered the structure of DNA?",
      options: ["Rosalind Franklin", "James Watson and Francis Crick", "Linus Pauling", "Maurice Wilkins"],
      answer: "James Watson and Francis Crick",
      category: "Science",
      explanation: "James Watson and Francis Crick discovered the double helix structure of DNA in 1953 with contributions from Rosalind Franklin's X-ray diffraction images."
    },
    {
      question: "What is the approximate age of the universe?",
      options: ["4.5 billion years", "13.8 billion years", "10.2 billion years", "16.4 billion years"],
      answer: "13.8 billion years",
      category: "Science",
      explanation: "The universe is approximately 13.8 billion years old, based on measurements of the cosmic microwave background radiation."
    },
    {
      question: "Who wrote 'The Brothers Karamazov'?",
      options: ["Leo Tolstoy", "Fyodor Dostoevsky", "Anton Chekhov", "Ivan Turgenev"],
      answer: "Fyodor Dostoevsky",
      category: "Literature",
      explanation: "Fyodor Dostoevsky wrote 'The Brothers Karamazov' in 1880, his final novel exploring faith, doubt, and morality."
    },
    {
      question: "What is the chemical symbol for lead?",
      options: ["Ld", "Pb", "Pl", "Le"],
      answer: "Pb",
      category: "Science",
      explanation: "Pb comes from the Latin word for lead, 'plumbum'. Lead has been used since ancient times for pipes and weights."
    },
    {
      question: "Which composer wrote 'The Rite of Spring'?",
      options: ["Stravinsky", "Debussy", "Ravel", "Shostakovich"],
      answer: "Stravinsky",
      category: "Music",
      explanation: "Igor Stravinsky composed 'The Rite of Spring' in 1913, which caused a riot at its premiere due to its avant-garde nature."
    },
    {
      question: "What is the capital of Myanmar?",
      options: ["Yangon", "Naypyidaw", "Mandalay", "Bangkok"],
      answer: "Naypyidaw",
      category: "Geography",
      explanation: "Naypyidaw became the capital of Myanmar in 2006, replacing Yangon. It was built from scratch in a central location."
    }
  ]
};

// Get quiz questions for a specific difficulty
export const getQuizQuestions = (difficulty = 'medium', count = 15) => {
  const questions = QUIZ_QUESTIONS[difficulty] || QUIZ_QUESTIONS.medium;
  return shuffleArray([...questions]).slice(0, count);
};

// Calculate points based on difficulty, time remaining, and streak
export const calculatePoints = (difficulty, timeRemaining, streak = 0) => {
  const basePoints = {
    easy: 10,
    medium: 20,
    hard: 30,
    extreme: 50
  };
  
  const timeBonus = Math.floor(timeRemaining / 5) * 2;
  const streakBonus = Math.min(50, streak * 5);
  
  return basePoints[difficulty] + timeBonus + streakBonus;
};

// Check if answer is correct
export const checkAnswer = (question, selectedAnswer) => {
  return question.answer === selectedAnswer;
};

// Generate question ID
export const generateQuestionId = (question) => {
  return question.question.replace(/\s+/g, '_').toLowerCase();
};

// Get all quiz categories
export const getQuizCategories = () => {
  const categories = new Set();
  
  Object.values(QUIZ_QUESTIONS).forEach(difficultyQuestions => {
    difficultyQuestions.forEach(question => {
      categories.add(question.category);
    });
  });
  
  return Array.from(categories);
};

// Get questions by category
export const getQuestionsByCategory = (category, difficulty = 'medium') => {
  const questions = QUIZ_QUESTIONS[difficulty] || QUIZ_QUESTIONS.medium;
  return questions.filter(question => question.category === category);
};