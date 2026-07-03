export const tripMeta = {
  tripName: 'First Solo Bike Road Trip Planner',
  dateRange: '05-12-2026 to 09-01-2027',
  startLocation: 'Bangalore',
  currency: 'INR',
  targetBudget: 120000,
};

export const starterExpenseCategories = [
  'Fuel',
  'Food',
  'Stay',
  'Shopping',
  'Bike',
  'Temple',
  'Other',
];

export const planningChecklist = [
  { id: 'vehicle-service', label: 'Get the car serviced and check tyres', done: false },
  { id: 'official-calls', label: 'Call officials for trek and timing confirmations', done: false },
  { id: 'docs-backup', label: 'Save driving licence, RC, insurance, and IDs offline', done: true },
  { id: 'hotel-shortlist', label: 'Shortlist stays for the next 3 fixed nights', done: false },
];

export const packingChecklist = [
  { id: 'clothes', label: 'Pack clothes for heat, beach, and temple visits', done: false },
  { id: 'camera', label: 'Pack camera gear and storage cards', done: false },
  { id: 'chargers', label: 'Pack chargers, car charger, and power bank', done: true },
  { id: 'medicines', label: 'Pack first aid and regular medicines', done: false },
];

export const starterExpenses = [
  {
    id: 'expense-fuel-1',
    title: 'Fuel top-up',
    category: 'Fuel',
    place: 'Bangalore',
    amount: 3200,
    date: '2026-07-01',
  },
];

export const starterShoppingList = [
  {
    id: 'shop-1',
    item: 'Power bank',
    link: 'https://example.com/power-bank',
    price: 2499,
    status: 'pending',
  },
  {
    id: 'shop-2',
    item: 'Car mobile holder',
    link: 'https://example.com/car-holder',
    price: 799,
    status: 'bought',
  },
];

export const starterNotes = [
  'This planner is now meant to be edited directly from the website.',
  'Use the map stop editor to change coordinates and smaller stop markers.',
  'Use the day planner table to keep route notes, food, and prep details in one place.',
].join('\n');

function createMinorStops(dayId, stops) {
  return stops.map((stop, index) => ({
    id: `${dayId}-stop-${index + 1}`,
    name: stop.name,
    url: stop.url,
    lat: '',
    lng: '',
    note: stop.note || '',
    distanceFromStart: stop.distanceFromStart || '',
  }));
}

function createRouteLines(stops) {
  return stops.map((stop) => `${stop.url} | ${stop.name}`).join('\n');
}

function buildDayPlan(day) {
  return {
    id: day.id,
    dayLabel: day.dayLabel,
    date: day.date,
    status: day.status,
    title: day.title,
    startPoint: day.startPoint,
    endPoint: day.endPoint,
    distance: day.distance,
    placesToStay: day.placesToStay,
    routeMapLink: day.routeMapLink,
    startLat: day.startLat,
    startLng: day.startLng,
    overnightLat: day.overnightLat,
    overnightLng: day.overnightLng,
    placesToGo: day.placesToGo,
    route: createRouteLines(day.routeStops),
    thingsToDo: day.thingsToDo,
    specialityFood: day.specialityFood,
    beforeGoing: day.beforeGoing,
    visited: day.status === 'VISITED',
    minorStops: createMinorStops(day.id, day.routeStops),
  };
}

export const initialDailyPlan = [
  buildDayPlan({
    id: 'day-1',
    dayLabel: 'Day 1',
    date: '05-12-2026',
    status: 'PENDING',
    title: 'Bangalore to Puducherry',
    startPoint: 'Bangalore',
    endPoint: 'Puducherry',
    distance: '310 km',
    placesToStay: 'White Town / Heritage Town guesthouse with secure bike parking',
    routeMapLink:
      'https://www.google.com/maps/dir/?api=1&origin=Bangalore&destination=Puducherry&travelmode=driving&waypoints=Krishnagiri%7CGingee%20Fort',
    startLat: 12.9716,
    startLng: 77.5946,
    overnightLat: 11.9416,
    overnightLng: 79.8083,
    placesToGo: 'Promenade Beach\nWhite Town\nRock Beach\ncafes',
    routeStops: [
      {
        name: 'Krishnagiri stop',
        url: 'https://www.google.com/maps/search/?api=1&query=Krishnagiri',
      },
      {
        name: 'Gingee Fort',
        url: 'https://www.google.com/maps/search/?api=1&query=Gingee%20Fort',
      },
    ],
    thingsToDo:
      'Start by 6:00 AM\nbreakfast near Krishnagiri\nquick photo stop at Gingee\nevening walk in White Town and Promenade',
    specialityFood: 'Filter coffee\nFrench bakery food\nseafood\ncrepes',
    beforeGoing:
      'Check luggage straps\ntyre pressure\nchain lube\ndocuments\noffline maps\nrain layer',
  }),
  buildDayPlan({
    id: 'day-2',
    dayLabel: 'Day 2',
    date: '06-12-2026',
    status: 'PENDING',
    title: 'Puducherry explore',
    startPoint: 'Puducherry',
    endPoint: 'Puducherry',
    distance: 'Local / 40-70 km',
    placesToStay: 'Same White Town / Heritage Town stay',
    routeMapLink: 'https://www.google.com/maps/search/?api=1&query=Puducherry',
    startLat: 11.9416,
    startLng: 79.8083,
    overnightLat: 11.9416,
    overnightLng: 79.8083,
    placesToGo:
      'Auroville\nMatrimandir viewpoint\nSerenity Beach\nEden Beach\nParadise Beach\nFrench Quarter',
    routeStops: [
      {
        name: 'Auroville',
        url: 'https://www.google.com/maps/search/?api=1&query=Auroville',
      },
      {
        name: 'Eden Beach',
        url: 'https://www.google.com/maps/search/?api=1&query=Eden%20Beach%20Puducherry',
      },
    ],
    thingsToDo:
      'Slow breakfast\nvisit Auroville\nbeach time\nevening cafe hopping\ndo laundry if needed',
    specialityFood: 'Croissants\nwood-fired pizza\nseafood\nSouth Indian breakfast',
    beforeGoing:
      'Book/confirm next stay in Thanjavur\navoid late-night beach rides\nrefuel before night',
  }),
  buildDayPlan({
    id: 'day-3',
    dayLabel: 'Day 3',
    date: '07-12-2026',
    status: 'PENDING',
    title: 'Puducherry to Thanjavur',
    startPoint: 'Puducherry',
    endPoint: 'Thanjavur',
    distance: '200 km',
    placesToStay: 'Near Brihadeeswara Temple or old town hotel with parking',
    routeMapLink:
      'https://www.google.com/maps/dir/?api=1&origin=Puducherry&destination=Thanjavur&travelmode=driving&waypoints=Chidambaram%7CKumbakonam',
    startLat: 11.9416,
    startLng: 79.8083,
    overnightLat: 10.787,
    overnightLng: 79.1378,
    placesToGo:
      'Brihadeeswara Temple\nThanjavur Palace\nSaraswathi Mahal Library',
    routeStops: [
      {
        name: 'Chidambaram',
        url: 'https://www.google.com/maps/search/?api=1&query=Chidambaram',
      },
      {
        name: 'Kumbakonam',
        url: 'https://www.google.com/maps/search/?api=1&query=Kumbakonam',
      },
    ],
    thingsToDo:
      'Leave by 7:00 AM\ntemple-town ride\nreach before evening\nsee Brihadeeswara Temple around sunset/night lighting',
    specialityFood: 'Thanjavur meals\nKumbakonam degree coffee\ntemple prasadam',
    beforeGoing:
      'Temple dress modestly\ncheck temple timings\nkeep camera/bag rules in mind',
  }),
  buildDayPlan({
    id: 'day-4',
    dayLabel: 'Day 4',
    date: '08-12-2026',
    status: 'PENDING',
    title: 'Thanjavur to Karaikudi',
    startPoint: 'Thanjavur',
    endPoint: 'Karaikudi',
    distance: '110 km',
    placesToStay: 'Chettinad heritage mansion stay or central Karaikudi hotel',
    routeMapLink:
      'https://www.google.com/maps/dir/?api=1&origin=Thanjavur&destination=Karaikudi&travelmode=driving&waypoints=Trichy%7CPillayarpatti',
    startLat: 10.787,
    startLng: 79.1378,
    overnightLat: 10.0731,
    overnightLng: 78.7802,
    placesToGo:
      'Chettinad mansions\nAthangudi tiles\nantique market\nPillayarpatti temple',
    routeStops: [
      {
        name: 'Trichy',
        url: 'https://www.google.com/maps/search/?api=1&query=Trichy',
      },
      {
        name: 'Pillayarpatti',
        url: 'https://www.google.com/maps/search/?api=1&query=Pillayarpatti',
      },
    ],
    thingsToDo:
      'Short recovery ride\nexplore Chettinad architecture\nrelaxed lunch\nwalk local antique streets',
    specialityFood: 'Chettinad chicken\npaniyaram\nidiyappam\nkavuni arisi',
    beforeGoing:
      'Use the short day to wash clothes\ntighten bolts\nclean visor\ntop up cash',
  }),
  buildDayPlan({
    id: 'day-5',
    dayLabel: 'Day 5',
    date: '09-12-2026',
    status: 'PENDING',
    title: 'Karaikudi to Rameswaram',
    startPoint: 'Karaikudi',
    endPoint: 'Rameswaram',
    distance: '160 km',
    placesToStay: 'Rameswaram town hotel with private/secure parking',
    routeMapLink:
      'https://www.google.com/maps/dir/?api=1&origin=Karaikudi&destination=Rameswaram&travelmode=driving&waypoints=Ramanathapuram%7CPamban%20Bridge',
    startLat: 10.0731,
    startLng: 78.7802,
    overnightLat: 9.2876,
    overnightLng: 79.3129,
    placesToGo:
      'Pamban Bridge\nRameswaram beach\nRamanathaswamy Temple exterior',
    routeStops: [
      {
        name: 'Ramanathapuram',
        url: 'https://www.google.com/maps/search/?api=1&query=Ramanathapuram',
      },
      {
        name: 'Pamban Bridge',
        url: 'https://www.google.com/maps/search/?api=1&query=Pamban%20Bridge',
      },
    ],
    thingsToDo:
      'Start easy\nride into Rameswaram before wind picks up\nPamban sunset\nsimple dinner',
    specialityFood: 'South Tamil meals\nseafood\njigarthanda if found',
    beforeGoing:
      'Check wind/weather before bridge section\nkeep fuel above half tank',
  }),
  buildDayPlan({
    id: 'day-6',
    dayLabel: 'Day 6',
    date: '10-12-2026',
    status: 'PENDING',
    title: 'Rameswaram explore',
    startPoint: 'Rameswaram',
    endPoint: 'Rameswaram',
    distance: 'Local / 40-70 km',
    placesToStay: 'Same Rameswaram stay',
    routeMapLink: 'https://www.google.com/maps/search/?api=1&query=Rameswaram',
    startLat: 9.2876,
    startLng: 79.3129,
    overnightLat: 9.2876,
    overnightLng: 79.3129,
    placesToGo:
      'Dhanushkodi\nArichal Munai\nRamanathaswamy Temple\nAPJ Abdul Kalam Memorial',
    routeStops: [
      {
        name: 'Dhanushkodi',
        url: 'https://www.google.com/maps/search/?api=1&query=Dhanushkodi',
      },
      {
        name: 'Kalam Memorial',
        url: 'https://www.google.com/maps/search/?api=1&query=APJ%20Abdul%20Kalam%20Memorial',
      },
    ],
    thingsToDo:
      'Dhanushkodi sunrise if conditions allow\ntemple visit\nmemorial\nrest in afternoon heat/wind',
    specialityFood: 'Idli/dosa\nfish fry\nTamil meals',
    beforeGoing:
      'Confirm Dhanushkodi access locally\navoid riding beyond permitted zones\ncharge power bank',
  }),
  buildDayPlan({
    id: 'day-7',
    dayLabel: 'Day 7',
    date: '11-12-2026',
    status: 'PENDING',
    title: 'Rameswaram to Tiruchendur',
    startPoint: 'Rameswaram',
    endPoint: 'Tiruchendur',
    distance: '220 km',
    placesToStay: 'Beach/temple side hotel with parking',
    routeMapLink:
      'https://www.google.com/maps/dir/?api=1&origin=Rameswaram&destination=Tiruchendur&travelmode=driving&waypoints=Sayalkudi%7CThoothukudi',
    startLat: 9.2876,
    startLng: 79.3129,
    overnightLat: 8.497,
    overnightLng: 78.119,
    placesToGo:
      'Tiruchendur beach\nSubramaniya Swamy Temple\nseafront walk',
    routeStops: [
      {
        name: 'Sayalkudi',
        url: 'https://www.google.com/maps/search/?api=1&query=Sayalkudi',
      },
      {
        name: 'Thoothukudi',
        url: 'https://www.google.com/maps/search/?api=1&query=Thoothukudi',
      },
    ],
    thingsToDo:
      'Coastal ride\nlunch near Thoothukudi\nreach before dark\ntemple/beach evening',
    specialityFood: 'Thoothukudi macaroons\nparotta\nseafood',
    beforeGoing:
      'Cross-check coastal wind/rain\nhydrate well\navoid empty stretches late evening',
  }),
  buildDayPlan({
    id: 'day-8',
    dayLabel: 'Day 8',
    date: '12-12-2026',
    status: 'PENDING',
    title: 'Tiruchendur to Varkala via Kanyakumari',
    startPoint: 'Tiruchendur',
    endPoint: 'Varkala',
    distance: '230 km',
    placesToStay: 'Varkala cliff stay with secure parking',
    routeMapLink:
      'https://www.google.com/maps/dir/?api=1&origin=Tiruchendur&destination=Varkala&travelmode=driving&waypoints=Manapad%7CKanyakumari%7CPoovar',
    startLat: 8.497,
    startLng: 78.119,
    overnightLat: 8.7379,
    overnightLng: 76.7163,
    placesToGo: 'Manapad viewpoint\nKanyakumari sea point\nVarkala Cliff',
    routeStops: [
      {
        name: 'Manapad',
        url: 'https://www.google.com/maps/search/?api=1&query=Manapad',
      },
      {
        name: 'Kanyakumari',
        url: 'https://www.google.com/maps/search/?api=1&query=Kanyakumari',
      },
    ],
    thingsToDo:
      'Start early\nspend 1-2 hours at Kanyakumari\nreach Varkala by evening\ncliff cafe dinner',
    specialityFood: 'Kerala seafood\nappam-stew\nbanana chips',
    beforeGoing:
      'Do not overstay at Kanyakumari\nKerala coastal traffic can slow you down',
  }),
  buildDayPlan({
    id: 'day-9',
    dayLabel: 'Day 9',
    date: '13-12-2026',
    status: 'PENDING',
    title: 'Varkala explore',
    startPoint: 'Varkala',
    endPoint: 'Varkala',
    distance: 'Local / 20-50 km',
    placesToStay: 'Same Varkala cliff stay',
    routeMapLink: 'https://www.google.com/maps/search/?api=1&query=Varkala',
    startLat: 8.7379,
    startLng: 76.7163,
    overnightLat: 8.7379,
    overnightLng: 76.7163,
    placesToGo:
      'Varkala Cliff\nPapanasam Beach\nJanardhana Swamy Temple\nKappil Beach',
    routeStops: [
      {
        name: 'Kappil Beach',
        url: 'https://www.google.com/maps/search/?api=1&query=Kappil%20Beach',
      },
      {
        name: 'Janardhana Temple',
        url: 'https://www.google.com/maps/search/?api=1&query=Janardhana%20Swamy%20Temple%20Varkala',
      },
    ],
    thingsToDo:
      'Sleep in\ncliff walk\nbeach time only in safe zones\nsunset from cliff\nlaundry/rest',
    specialityFood: 'Kerala sadya\nseafood grill\nputtu-kadala\nfresh juices',
    beforeGoing:
      'Book Kochi stay\navoid swimming if warning flags/currents are strong',
  }),
  buildDayPlan({
    id: 'day-10',
    dayLabel: 'Day 10',
    date: '14-12-2026',
    status: 'PENDING',
    title: 'Varkala to Kochi',
    startPoint: 'Varkala',
    endPoint: 'Kochi',
    distance: '170 km',
    placesToStay: 'Fort Kochi or Mattancherry stay with parking',
    routeMapLink:
      'https://www.google.com/maps/dir/?api=1&origin=Varkala&destination=Fort%20Kochi&travelmode=driving&waypoints=Kollam%7CAlleppey%7CMarari%20Beach',
    startLat: 8.7379,
    startLng: 76.7163,
    overnightLat: 9.9656,
    overnightLng: 76.2422,
    placesToGo:
      'Fort Kochi\nChinese fishing nets\nMattancherry Palace\nJew Town',
    routeStops: [
      {
        name: 'Alleppey',
        url: 'https://www.google.com/maps/search/?api=1&query=Alleppey',
      },
      {
        name: 'Marari Beach',
        url: 'https://www.google.com/maps/search/?api=1&query=Marari%20Beach',
      },
    ],
    thingsToDo:
      'Easy coastal ride\nstop at Alleppey/Marari\nevening in Fort Kochi',
    specialityFood: 'Kerala meals\nbeef fry if you eat it\nseafood\nbanana fritters',
    beforeGoing:
      'Check Kochi traffic/ferry timings if using ferries\nkeep bike parked safely at night',
  }),
  buildDayPlan({
    id: 'day-11',
    dayLabel: 'Day 11',
    date: '15-12-2026',
    status: 'PENDING',
    title: 'Kochi to Munnar',
    startPoint: 'Kochi',
    endPoint: 'Munnar',
    distance: '130 km',
    placesToStay: 'Munnar town/Chithirapuram stay with safe parking',
    routeMapLink:
      'https://www.google.com/maps/dir/?api=1&origin=Fort%20Kochi&destination=Munnar&travelmode=driving&waypoints=Thattekkad%7CCheeyappara%20Waterfalls%7CValara%20Waterfalls',
    startLat: 9.9656,
    startLng: 76.2422,
    overnightLat: 10.0889,
    overnightLng: 77.0595,
    placesToGo:
      'Cheeyappara Falls\nValara Falls\ntea estates\nPothamedu viewpoint',
    routeStops: [
      {
        name: 'Thattekkad',
        url: 'https://www.google.com/maps/search/?api=1&query=Thattekkad',
      },
      {
        name: 'Cheeyappara',
        url: 'https://www.google.com/maps/search/?api=1&query=Cheeyappara%20Waterfalls',
      },
    ],
    thingsToDo:
      'Leave early to enjoy ghats in daylight\nshort waterfall stops\ntea estate sunset',
    specialityFood: 'Kerala meals\ntea\npazham pori\nlocal chocolate',
    beforeGoing:
      'Fill fuel before ghats\ncarry warm layer\navoid night riding in Munnar roads',
  }),
  buildDayPlan({
    id: 'day-12',
    dayLabel: 'Day 12',
    date: '16-12-2026',
    status: 'PENDING',
    title: 'Munnar explore',
    startPoint: 'Munnar',
    endPoint: 'Munnar',
    distance: 'Local / 60-100 km',
    placesToStay: 'Same Munnar stay',
    routeMapLink: 'https://www.google.com/maps/search/?api=1&query=Munnar',
    startLat: 10.0889,
    startLng: 77.0595,
    overnightLat: 10.0889,
    overnightLng: 77.0595,
    placesToGo:
      'Kolukkumalai\nTea Museum\nMattupetty Dam\nEcho Point\nTop Station',
    routeStops: [
      {
        name: 'Kolukkumalai',
        url: 'https://www.google.com/maps/search/?api=1&query=Kolukkumalai',
      },
      {
        name: 'Top Station',
        url: 'https://www.google.com/maps/search/?api=1&query=Top%20Station%20Munnar',
      },
    ],
    thingsToDo:
      'Kolukkumalai sunrise by jeep\nlater Tea Museum/Mattupetty/Top Station depending on energy',
    specialityFood: 'Tea\nKerala parotta\nappam\nhomemade chocolate',
    beforeGoing:
      'Book jeep in advance\ncarry cash\ncheck fog\ndo not force all viewpoints if tired',
  }),
  buildDayPlan({
    id: 'day-13',
    dayLabel: 'Day 13',
    date: '17-12-2026',
    status: 'PENDING',
    title: 'Munnar to Kozhikode',
    startPoint: 'Munnar',
    endPoint: 'Kozhikode',
    distance: '280 km',
    placesToStay: 'Kozhikode beach or city hotel with parking',
    routeMapLink:
      'https://www.google.com/maps/dir/?api=1&origin=Munnar&destination=Kozhikode&travelmode=driving&waypoints=Thrissur%7CKuttippuram',
    startLat: 10.0889,
    startLng: 77.0595,
    overnightLat: 11.2588,
    overnightLng: 75.7804,
    placesToGo: 'Kozhikode Beach\nSM Street\nMananchira Square',
    routeStops: [
      {
        name: 'Thrissur',
        url: 'https://www.google.com/maps/search/?api=1&query=Thrissur',
      },
      {
        name: 'Kuttippuram',
        url: 'https://www.google.com/maps/search/?api=1&query=Kuttippuram',
      },
    ],
    thingsToDo:
      'Longer day\nstart 6:30 AM\nkeep breaks disciplined\nbeach sunset if on time',
    specialityFood: 'Kozhikode biryani\nhalwa\nbanana chips\nsuleimani chai',
    beforeGoing:
      'Check brakes after ghats\navoid arriving too late\npre-book parking-friendly stay',
  }),
  buildDayPlan({
    id: 'day-14',
    dayLabel: 'Day 14',
    date: '18-12-2026',
    status: 'PENDING',
    title: 'Kozhikode to Udupi',
    startPoint: 'Kozhikode',
    endPoint: 'Udupi',
    distance: '290 km',
    placesToStay: 'Udupi town or Malpe stay with parking',
    routeMapLink:
      'https://www.google.com/maps/dir/?api=1&origin=Kozhikode&destination=Udupi&travelmode=driving&waypoints=Kannur%7CBekal%20Fort%7CMangalore',
    startLat: 11.2588,
    startLng: 75.7804,
    overnightLat: 13.3409,
    overnightLng: 74.7421,
    placesToGo: 'Bekal Fort\nMalpe Beach\nSri Krishna Matha',
    routeStops: [
      {
        name: 'Kannur',
        url: 'https://www.google.com/maps/search/?api=1&query=Kannur',
      },
      {
        name: 'Bekal Fort',
        url: 'https://www.google.com/maps/search/?api=1&query=Bekal%20Fort',
      },
    ],
    thingsToDo:
      'Coastal highway day\nlunch around Kannur/Kasaragod\nreach Udupi before dark',
    specialityFood: 'Udupi meals\nneer dosa\ngoli baje\nfish curry',
    beforeGoing:
      'Watch coastal traffic\navoid beach swimming after dark\ncheck next day\'s shorter route',
  }),
  buildDayPlan({
    id: 'day-15',
    dayLabel: 'Day 15',
    date: '19-12-2026',
    status: 'PENDING',
    title: 'Udupi to Gokarna',
    startPoint: 'Udupi',
    endPoint: 'Gokarna',
    distance: '180 km',
    placesToStay: 'Gokarna town/Kudle side stay with bike parking',
    routeMapLink:
      'https://www.google.com/maps/dir/?api=1&origin=Udupi&destination=Gokarna&travelmode=driving&waypoints=Maravanthe%20Beach%7CMurudeshwar%7CHonnavar',
    startLat: 13.3409,
    startLng: 74.7421,
    overnightLat: 14.5479,
    overnightLng: 74.3188,
    placesToGo:
      'Maravanthe Beach\nMurudeshwar\nHonnavar\nOm Beach\nKudle Beach',
    routeStops: [
      {
        name: 'Maravanthe',
        url: 'https://www.google.com/maps/search/?api=1&query=Maravanthe%20Beach',
      },
      {
        name: 'Murudeshwar',
        url: 'https://www.google.com/maps/search/?api=1&query=Murudeshwar',
      },
    ],
    thingsToDo:
      'Scenic coastal ride\nMurudeshwar stop\nreach Gokarna for Om/Kudle sunset',
    specialityFood: 'Coastal fish thali\nUdupi breakfast\nkokum soda',
    beforeGoing:
      'Respect temple dress codes\ndo not leave luggage exposed at beach stops',
  }),
  buildDayPlan({
    id: 'day-16',
    dayLabel: 'Day 16',
    date: '20-12-2026',
    status: 'PENDING',
    title: 'Gokarna to Goa',
    startPoint: 'Gokarna',
    endPoint: 'Goa - Palolem / South Goa',
    distance: '145 km',
    placesToStay: 'Palolem/Agonda/Canacona stay with secure parking',
    routeMapLink:
      'https://www.google.com/maps/dir/?api=1&origin=Gokarna&destination=Palolem%20Beach&travelmode=driving&waypoints=Karwar',
    startLat: 14.5479,
    startLng: 74.3188,
    overnightLat: 15.0097,
    overnightLng: 74.0232,
    placesToGo: 'Karwar\nPalolem Beach\nAgonda Beach\nPatnem Beach',
    routeStops: [
      {
        name: 'Karwar',
        url: 'https://www.google.com/maps/search/?api=1&query=Karwar',
      },
      {
        name: 'Palolem',
        url: 'https://www.google.com/maps/search/?api=1&query=Palolem%20Beach',
      },
    ],
    thingsToDo:
      'Short relaxed ride\ncheck in early\nbeach shack evening\nno hard riding',
    specialityFood: 'Goan fish curry rice\npoi\nbebinca\nkokum',
    beforeGoing:
      'Confirm Goa hotel parking\ncarry licence/insurance/PUC handy for checks',
  }),
  buildDayPlan({
    id: 'day-17',
    dayLabel: 'Day 17',
    date: '21-12-2026',
    status: 'PENDING',
    title: 'Goa explore',
    startPoint: 'Goa - Palolem / South Goa',
    endPoint: 'Goa - Palolem / South Goa',
    distance: 'Local / 60-120 km',
    placesToStay: 'Same South Goa stay',
    routeMapLink: 'https://www.google.com/maps/search/?api=1&query=South%20Goa',
    startLat: 15.0097,
    startLng: 74.0232,
    overnightLat: 15.0097,
    overnightLng: 74.0232,
    placesToGo:
      'Palolem\nAgonda\nCabo de Rama\nCola Beach\nFontainhas optional',
    routeStops: [
      {
        name: 'Cabo de Rama',
        url: 'https://www.google.com/maps/search/?api=1&query=Cabo%20de%20Rama',
      },
      {
        name: 'Fontainhas',
        url: 'https://www.google.com/maps/search/?api=1&query=Fontainhas%20Goa',
      },
    ],
    thingsToDo:
      'Beach/cafe day\noptional fort ride\nbike chain clean and tyre inspection before Hampi',
    specialityFood: 'Goan prawn curry\nxacuti\ncafreal\nbebinca',
    beforeGoing:
      'Avoid drinking and riding\ninspect tyres/brakes\nsleep early for Goa-Hampi',
  }),
  buildDayPlan({
    id: 'day-18',
    dayLabel: 'Day 18',
    date: '22-12-2026',
    status: 'PENDING',
    title: 'Goa to Hampi',
    startPoint: 'Goa - Palolem / South Goa',
    endPoint: 'Hampi',
    distance: '320 km',
    placesToStay: 'Hampi/Hospet stay with parking',
    routeMapLink:
      'https://www.google.com/maps/dir/?api=1&origin=Palolem%20Beach&destination=Hampi&travelmode=driving&waypoints=Mollem%7CDharwad%7CHubballi%7CGadag',
    startLat: 15.0097,
    startLng: 74.0232,
    overnightLat: 15.335,
    overnightLng: 76.46,
    placesToGo: 'Mollem ghat route\nHampi Bazaar\nHemakuta Hill',
    routeStops: [
      {
        name: 'Mollem',
        url: 'https://www.google.com/maps/search/?api=1&query=Mollem',
      },
      {
        name: 'Gadag',
        url: 'https://www.google.com/maps/search/?api=1&query=Gadag',
      },
    ],
    thingsToDo:
      'One of the harder ride days\nstart before sunrise\nreach before sunset\nHemakuta if energy remains',
    specialityFood: 'North Karnataka meals\njolada rotti\nlocal thali',
    beforeGoing:
      'Fuel early\ndownload route\navoid forest/ghat sections after dark',
  }),
  buildDayPlan({
    id: 'day-19',
    dayLabel: 'Day 19',
    date: '23-12-2026',
    status: 'PENDING',
    title: 'Hampi to Kurnool',
    startPoint: 'Hampi',
    endPoint: 'Kurnool',
    distance: '290 km',
    placesToStay: 'Kurnool city hotel with parking',
    routeMapLink:
      'https://www.google.com/maps/dir/?api=1&origin=Hampi&destination=Kurnool&travelmode=driving&waypoints=Hospet%7CAdoni',
    startLat: 15.335,
    startLng: 76.46,
    overnightLat: 15.8281,
    overnightLng: 78.0373,
    placesToGo:
      'Virupaksha Temple\nVittala Temple\nStone Chariot\nTungabhadra riverside',
    routeStops: [
      {
        name: 'Virupaksha',
        url: 'https://www.google.com/maps/search/?api=1&query=Virupaksha%20Temple%20Hampi',
      },
      {
        name: 'Adoni',
        url: 'https://www.google.com/maps/search/?api=1&query=Adoni',
      },
    ],
    thingsToDo:
      'Do sunrise/early monuments\nleave by late morning\nreach Kurnool and rest',
    specialityFood: 'Andhra meals\nbiryani\nspicy curries',
    beforeGoing:
      'Do not over-explore Hampi before ride\nhydrate\nconfirm Hyderabad arrival stay',
  }),
  buildDayPlan({
    id: 'day-20',
    dayLabel: 'Day 20',
    date: '24-12-2026',
    status: 'PENDING',
    title: 'Kurnool to Hyderabad',
    startPoint: 'Kurnool',
    endPoint: 'Hyderabad',
    distance: '220 km',
    placesToStay: 'Hyderabad stay near your birthday plans / secure parking',
    routeMapLink:
      'https://www.google.com/maps/dir/?api=1&origin=Kurnool&destination=Hyderabad&travelmode=driving&waypoints=Jadcherla',
    startLat: 15.8281,
    startLng: 78.0373,
    overnightLat: 17.385,
    overnightLng: 78.4867,
    placesToGo: 'Tank Bund\nNecklace Road\nCharminar night view optional',
    routeStops: [
      {
        name: 'Jadcherla',
        url: 'https://www.google.com/maps/search/?api=1&query=Jadcherla',
      },
      {
        name: 'Tank Bund',
        url: 'https://www.google.com/maps/search/?api=1&query=Tank%20Bund%20Hyderabad',
      },
    ],
    thingsToDo:
      'Reach Hyderabad comfortably\nsettle in\nlight city evening\nno heavy sightseeing',
    specialityFood: 'Hyderabadi biryani\nhaleem if available\nIrani chai',
    beforeGoing:
      'Book birthday dinner\nservice/inspect bike if needed\nkeep 25 Dec light and fun',
  }),
  buildDayPlan({
    id: 'day-21',
    dayLabel: 'Day 21',
    date: '25-12-2026',
    status: 'PENDING',
    title: 'Hyderabad birthday stay',
    startPoint: 'Hyderabad',
    endPoint: 'Hyderabad',
    distance: 'Local / 20-60 km',
    placesToStay: 'Same Hyderabad stay',
    routeMapLink: 'https://www.google.com/maps/search/?api=1&query=Hyderabad',
    startLat: 17.385,
    startLng: 78.4867,
    overnightLat: 17.385,
    overnightLng: 78.4867,
    placesToGo:
      'Charminar\nLaad Bazaar\nChowmahalla Palace\nGolconda Fort\nQutb Shahi Tombs',
    routeStops: [
      {
        name: 'Charminar',
        url: 'https://www.google.com/maps/search/?api=1&query=Charminar',
      },
      {
        name: 'Golconda',
        url: 'https://www.google.com/maps/search/?api=1&query=Golconda%20Fort',
      },
    ],
    thingsToDo:
      'Birthday day\nold city morning\nrelaxed lunch\nGolconda/Qutb Shahi in evening\nrooftop dinner',
    specialityFood:
      'Hyderabadi biryani\nIrani chai\nOsmania biscuits\ndouble ka meetha',
    beforeGoing:
      'Avoid over-riding inside city traffic\nconfirm 26 Dec departure route and Nirmal stay',
  }),
  buildDayPlan({
    id: 'day-22',
    dayLabel: 'Day 22',
    date: '26-12-2026',
    status: 'PENDING',
    title: 'Hyderabad to Nirmal',
    startPoint: 'Hyderabad',
    endPoint: 'Nirmal',
    distance: '220 km',
    placesToStay: 'Nirmal highway/city hotel with secure parking',
    routeMapLink:
      'https://www.google.com/maps/dir/?api=1&origin=Hyderabad&destination=Nirmal&travelmode=driving&waypoints=Medchal%7CKamareddy%7CNizamabad',
    startLat: 17.385,
    startLng: 78.4867,
    overnightLat: 19.0964,
    overnightLng: 78.3441,
    placesToGo: 'Nirmal town\nlocal craft shops\nquiet evening',
    routeStops: [
      {
        name: 'Kamareddy',
        url: 'https://www.google.com/maps/search/?api=1&query=Kamareddy',
      },
      {
        name: 'Nizamabad',
        url: 'https://www.google.com/maps/search/?api=1&query=Nizamabad',
      },
    ],
    thingsToDo:
      'Post-birthday easy day\nleave after city traffic thins\nreach early\nrest well',
    specialityFood: 'Telangana meals\nbiryani\nlocal snacks',
    beforeGoing:
      'Check chain slack and tyre pressure after Hyderabad\ncarry snacks/water',
  }),
  buildDayPlan({
    id: 'day-23',
    dayLabel: 'Day 23',
    date: '27-12-2026',
    status: 'PENDING',
    title: 'Nirmal to Nagpur',
    startPoint: 'Nirmal',
    endPoint: 'Nagpur',
    distance: '280 km',
    placesToStay: 'Nagpur city hotel with safe parking',
    routeMapLink:
      'https://www.google.com/maps/dir/?api=1&origin=Nirmal&destination=Nagpur&travelmode=driving&waypoints=Adilabad%7CHinganghat',
    startLat: 19.0964,
    startLng: 78.3441,
    overnightLat: 21.1458,
    overnightLng: 79.0882,
    placesToGo: 'Futala Lake\nZero Mile Stone\nSitabuldi area',
    routeStops: [
      {
        name: 'Adilabad',
        url: 'https://www.google.com/maps/search/?api=1&query=Adilabad',
      },
      {
        name: 'Futala Lake',
        url: 'https://www.google.com/maps/search/?api=1&query=Futala%20Lake',
      },
    ],
    thingsToDo:
      'Steady highway day\nbreaks at Adilabad and before Nagpur\nlight evening only',
    specialityFood: 'Nagpur oranges\nSaoji food\ntarri poha',
    beforeGoing:
      'Start early\navoid pushing speed on highways\ncheck hotel parking before entering city',
  }),
  buildDayPlan({
    id: 'day-24',
    dayLabel: 'Day 24',
    date: '28-12-2026',
    status: 'PENDING',
    title: 'Nagpur to Gondia',
    startPoint: 'Nagpur',
    endPoint: 'Gondia',
    distance: '160 km',
    placesToStay: 'Gondia town hotel with parking',
    routeMapLink:
      'https://www.google.com/maps/dir/?api=1&origin=Nagpur&destination=Gondia&travelmode=driving&waypoints=Bhandara',
    startLat: 21.1458,
    startLng: 79.0882,
    overnightLat: 21.4624,
    overnightLng: 80.221,
    placesToGo: 'Bhandara stop\nGondia local market\nrest',
    routeStops: [
      {
        name: 'Bhandara',
        url: 'https://www.google.com/maps/search/?api=1&query=Bhandara',
      },
      {
        name: 'Gondia',
        url: 'https://www.google.com/maps/search/?api=1&query=Gondia',
      },
    ],
    thingsToDo:
      'Short recovery ride\nuse extra time for sleep\nlaundry\nbike check',
    specialityFood: 'Poha\nSaoji-style food\nsimple thali',
    beforeGoing:
      'This is a buffer-style day\nconfirm Raipur arrival time with family',
  }),
  buildDayPlan({
    id: 'day-25',
    dayLabel: 'Day 25',
    date: '29-12-2026',
    status: 'PENDING',
    title: 'Gondia to Raipur',
    startPoint: 'Gondia',
    endPoint: 'Raipur',
    distance: '200 km',
    placesToStay: 'Home in Raipur',
    routeMapLink:
      'https://www.google.com/maps/dir/?api=1&origin=Gondia&destination=Raipur&travelmode=driving&waypoints=Rajnandgaon%7CDurg',
    startLat: 21.4624,
    startLng: 80.221,
    overnightLat: 21.2514,
    overnightLng: 81.6296,
    placesToGo: 'Rajnandgaon\nDurg/Bhilai\nRaipur home',
    routeStops: [
      {
        name: 'Rajnandgaon',
        url: 'https://www.google.com/maps/search/?api=1&query=Rajnandgaon',
      },
      {
        name: 'Durg',
        url: 'https://www.google.com/maps/search/?api=1&query=Durg',
      },
    ],
    thingsToDo:
      'Easy ride home\nreach without sightseeing pressure\nunpack and relax',
    specialityFood:
      'Chhattisgarhi home food\nfara\nchila\nlocal sweets',
    beforeGoing:
      'Use Raipur halt for proper bike inspection/service before Bastar/Araku section',
  }),
  buildDayPlan({
    id: 'day-26',
    dayLabel: 'Day 26',
    date: '30-12-2026',
    status: 'PENDING',
    title: 'Raipur stay',
    startPoint: 'Raipur',
    endPoint: 'Raipur',
    distance: 'Local / 20-80 km',
    placesToStay: 'Home in Raipur',
    routeMapLink: 'https://www.google.com/maps/search/?api=1&query=Raipur',
    startLat: 21.2514,
    startLng: 81.6296,
    overnightLat: 21.2514,
    overnightLng: 81.6296,
    placesToGo:
      'Purkhouti Muktangan\nTelibandha Lake\nVivekananda Sarovar\nlocal markets',
    routeStops: [
      {
        name: 'Purkhouti',
        url: 'https://www.google.com/maps/search/?api=1&query=Purkhouti%20Muktangan',
      },
      {
        name: 'Telibandha',
        url: 'https://www.google.com/maps/search/?api=1&query=Telibandha%20Lake',
      },
    ],
    thingsToDo:
      'Family/home day\nservice bike\nbuy essentials\noptional evening lake walk',
    specialityFood:
      'Fara\nchila\nangakar roti\nmuthiya\nlocal sweets',
    beforeGoing:
      'Service bike\ninspect brake pads\ntop up engine oil/coolant\nbuy chain lube and puncture kit',
  }),
  buildDayPlan({
    id: 'day-27',
    dayLabel: 'Day 27',
    date: '31-12-2026',
    status: 'PENDING',
    title: 'Raipur to Jagdalpur',
    startPoint: 'Raipur',
    endPoint: 'Jagdalpur',
    distance: '290 km',
    placesToStay: 'Jagdalpur hotel/resort with secure parking',
    routeMapLink:
      'https://www.google.com/maps/dir/?api=1&origin=Raipur&destination=Jagdalpur&travelmode=driving&waypoints=Kanker%7CKeshkal%20Ghat%7CKondagaon',
    startLat: 21.2514,
    startLng: 81.6296,
    overnightLat: 19.0748,
    overnightLng: 82.008,
    placesToGo:
      'Kanker\nKeshkal Ghat\nKondagaon craft stop\nJagdalpur market',
    routeStops: [
      {
        name: 'Keshkal Ghat',
        url: 'https://www.google.com/maps/search/?api=1&query=Keshkal%20Ghat',
      },
      {
        name: 'Kondagaon',
        url: 'https://www.google.com/maps/search/?api=1&query=Kondagaon',
      },
    ],
    thingsToDo:
      'Start early\nride Keshkal in daylight\nreach Jagdalpur before New Year evening\nkeep night quiet',
    specialityFood: 'Bastar food\nlocal thali\ntribal market snacks',
    beforeGoing:
      'Avoid night riding\ncheck local road/security updates\nkeep family updated on route',
  }),
  buildDayPlan({
    id: 'day-28',
    dayLabel: 'Day 28',
    date: '01-01-2027',
    status: 'PENDING',
    title: 'Jagdalpur explore',
    startPoint: 'Jagdalpur',
    endPoint: 'Jagdalpur',
    distance: 'Local / 80-130 km',
    placesToStay: 'Same Jagdalpur stay',
    routeMapLink: 'https://www.google.com/maps/search/?api=1&query=Jagdalpur',
    startLat: 19.0748,
    startLng: 82.008,
    overnightLat: 19.0748,
    overnightLng: 82.008,
    placesToGo:
      'Chitrakote Falls\nTirathgarh Falls\nKanger Valley National Park\nKotumsar Cave if open',
    routeStops: [
      {
        name: 'Chitrakote',
        url: 'https://www.google.com/maps/search/?api=1&query=Chitrakote%20Falls',
      },
      {
        name: 'Kanger Valley',
        url: 'https://www.google.com/maps/search/?api=1&query=Kanger%20Valley%20National%20Park',
      },
    ],
    thingsToDo:
      'Waterfalls day\nstart with Chitrakote\ndo Kanger/Tirathgarh based on access\nno late forest riding',
    specialityFood:
      'Bastar tribal food\nmahua-based local items only if not riding\nrice dishes',
    beforeGoing:
      'Confirm park/cave timings and access locally\ncarry cash\navoid isolated routes after sunset',
  }),
  buildDayPlan({
    id: 'day-29',
    dayLabel: 'Day 29',
    date: '02-01-2027',
    status: 'PENDING',
    title: 'Jagdalpur to Jeypore',
    startPoint: 'Jagdalpur',
    endPoint: 'Jeypore',
    distance: '170-200 km',
    placesToStay: 'Jeypore/Koraput hotel with parking',
    routeMapLink:
      'https://www.google.com/maps/dir/?api=1&origin=Jagdalpur&destination=Jeypore&travelmode=driving&waypoints=Kotpad%7CKoraput',
    startLat: 19.0748,
    startLng: 82.008,
    overnightLat: 18.8563,
    overnightLng: 82.5716,
    placesToGo: 'Kotpad\nKoraput town\nlocal viewpoints',
    routeStops: [
      {
        name: 'Kotpad',
        url: 'https://www.google.com/maps/search/?api=1&query=Kotpad',
      },
      {
        name: 'Koraput',
        url: 'https://www.google.com/maps/search/?api=1&query=Koraput',
      },
    ],
    thingsToDo:
      'Shorter hill-transition day\ntake it slow\nenjoy coffee/ghat breaks\nearly check-in',
    specialityFood: 'Odia thali\npakhala if available\nlocal snacks',
    beforeGoing:
      'Check road condition for Koraput-Araku\ndownload offline maps\nkeep tank full',
  }),
  buildDayPlan({
    id: 'day-30',
    dayLabel: 'Day 30',
    date: '03-01-2027',
    status: 'PENDING',
    title: 'Jeypore to Araku',
    startPoint: 'Jeypore',
    endPoint: 'Araku Valley',
    distance: '130-150 km',
    placesToStay: 'Araku homestay/resort with secure bike parking',
    routeMapLink:
      'https://www.google.com/maps/dir/?api=1&origin=Jeypore&destination=Araku%20Valley&travelmode=driving&waypoints=Koraput',
    startLat: 18.8563,
    startLng: 82.5716,
    overnightLat: 18.3273,
    overnightLng: 82.8775,
    placesToGo:
      'Araku Valley\nCoffee Museum\nTribal Museum\nGalikonda viewpoint',
    routeStops: [
      {
        name: 'Koraput',
        url: 'https://www.google.com/maps/search/?api=1&query=Koraput',
      },
      {
        name: 'Araku Coffee Museum',
        url: 'https://www.google.com/maps/search/?api=1&query=Araku%20Coffee%20Museum',
      },
    ],
    thingsToDo:
      'Relaxed mountain-road day\nkeep stops short\nexplore Coffee Museum and Tribal Museum after check-in',
    specialityFood:
      'Araku coffee\nbamboo chicken\nlocal tribal meals',
    beforeGoing:
      'Winter fog possible\navoid late ghat riding\nbook stay early due New Year crowd',
  }),
  buildDayPlan({
    id: 'day-31',
    dayLabel: 'Day 31',
    date: '04-01-2027',
    status: 'PENDING',
    title: 'Araku to Visakhapatnam',
    startPoint: 'Araku Valley',
    endPoint: 'Visakhapatnam',
    distance: '120 km',
    placesToStay: 'Vizag beachside/city hotel with secure parking',
    routeMapLink:
      'https://www.google.com/maps/dir/?api=1&origin=Araku%20Valley&destination=Visakhapatnam&travelmode=driving&waypoints=Borra%20Caves%7CAnanthagiri',
    startLat: 18.3273,
    startLng: 82.8775,
    overnightLat: 17.6868,
    overnightLng: 83.2185,
    placesToGo:
      'Borra Caves\nAnanthagiri coffee plantations\nRK Beach\nTenneti Park',
    routeStops: [
      {
        name: 'Borra Caves',
        url: 'https://www.google.com/maps/search/?api=1&query=Borra%20Caves',
      },
      {
        name: 'RK Beach',
        url: 'https://www.google.com/maps/search/?api=1&query=RK%20Beach%20Visakhapatnam',
      },
    ],
    thingsToDo:
      'Visit Borra Caves en route\ndescend in daylight\nVizag beach evening',
    specialityFood:
      'Andhra seafood\npunugulu\nmuri mixture\nfilter coffee',
    beforeGoing:
      'Check Borra timings\ncarry cash\nwatch for tourist traffic on ghat roads',
  }),
  buildDayPlan({
    id: 'day-32',
    dayLabel: 'Day 32',
    date: '05-01-2027',
    status: 'PENDING',
    title: 'Visakhapatnam to Rajahmundry',
    startPoint: 'Visakhapatnam',
    endPoint: 'Rajahmundry',
    distance: '200 km',
    placesToStay: 'Rajahmundry hotel near river/city with parking',
    routeMapLink:
      'https://www.google.com/maps/dir/?api=1&origin=Visakhapatnam&destination=Rajahmundry&travelmode=driving&waypoints=Annavaram',
    startLat: 17.6868,
    startLng: 83.2185,
    overnightLat: 17.0005,
    overnightLng: 81.804,
    placesToGo:
      'Annavaram\nGodavari bridge/riverfront\nPushkar Ghat',
    routeStops: [
      {
        name: 'Annavaram',
        url: 'https://www.google.com/maps/search/?api=1&query=Annavaram',
      },
      {
        name: 'Godavari Bridge',
        url: 'https://www.google.com/maps/search/?api=1&query=Godavari%20Bridge%20Rajahmundry',
      },
    ],
    thingsToDo:
      'Highway day\nlunch around Annavaram\nrelaxed riverfront evening',
    specialityFood: 'Andhra meals\npesarattu\npootharekulu\nrose milk',
    beforeGoing:
      'Check coastal weather alerts\nkeep hydration high\navoid riding into late fog',
  }),
  buildDayPlan({
    id: 'day-33',
    dayLabel: 'Day 33',
    date: '06-01-2027',
    status: 'PENDING',
    title: 'Rajahmundry to Vijayawada',
    startPoint: 'Rajahmundry',
    endPoint: 'Vijayawada',
    distance: '160 km',
    placesToStay: 'Vijayawada city hotel with parking',
    routeMapLink:
      'https://www.google.com/maps/dir/?api=1&origin=Rajahmundry&destination=Vijayawada&travelmode=driving&waypoints=Eluru',
    startLat: 17.0005,
    startLng: 81.804,
    overnightLat: 16.5062,
    overnightLng: 80.648,
    placesToGo:
      'Prakasam Barrage\nUndavalli Caves\nKanaka Durga Temple',
    routeStops: [
      {
        name: 'Eluru',
        url: 'https://www.google.com/maps/search/?api=1&query=Eluru',
      },
      {
        name: 'Undavalli Caves',
        url: 'https://www.google.com/maps/search/?api=1&query=Undavalli%20Caves',
      },
    ],
    thingsToDo:
      'Short recovery ride\nexplore Undavalli/Prakasam Barrage\nearly dinner',
    specialityFood:
      'Andhra meals\ngongura\npesarattu\nspicy biryani',
    beforeGoing:
      'Confirm Nellore stay\ncheck bike chain/tyres after coastal highways',
  }),
  buildDayPlan({
    id: 'day-34',
    dayLabel: 'Day 34',
    date: '07-01-2027',
    status: 'PENDING',
    title: 'Vijayawada to Nellore',
    startPoint: 'Vijayawada',
    endPoint: 'Nellore',
    distance: '280 km',
    placesToStay: 'Nellore city or Mypadu-side hotel with parking',
    routeMapLink:
      'https://www.google.com/maps/dir/?api=1&origin=Vijayawada&destination=Nellore&travelmode=driving&waypoints=Ongole',
    startLat: 16.5062,
    startLng: 80.648,
    overnightLat: 14.4426,
    overnightLng: 79.9865,
    placesToGo: 'Ongole stop\nMypadu Beach\nNellore city',
    routeStops: [
      {
        name: 'Ongole',
        url: 'https://www.google.com/maps/search/?api=1&query=Ongole',
      },
      {
        name: 'Mypadu Beach',
        url: 'https://www.google.com/maps/search/?api=1&query=Mypadu%20Beach',
      },
    ],
    thingsToDo:
      'Longer but straightforward highway day\noptional Mypadu sunset if early',
    specialityFood:
      'Nellore meals\nfish curry\nspicy Andhra food',
    beforeGoing:
      'Watch highway fatigue\ntake 10-min breaks every 90 min\navoid beach roads after dark',
  }),
  buildDayPlan({
    id: 'day-35',
    dayLabel: 'Day 35',
    date: '08-01-2027',
    status: 'PENDING',
    title: 'Nellore to Tirupati',
    startPoint: 'Nellore',
    endPoint: 'Tirupati',
    distance: '140 km',
    placesToStay: 'Tirupati city hotel with secure parking',
    routeMapLink:
      'https://www.google.com/maps/dir/?api=1&origin=Nellore&destination=Tirupati&travelmode=driving&waypoints=Srikalahasti',
    startLat: 14.4426,
    startLng: 79.9865,
    overnightLat: 13.6288,
    overnightLng: 79.4192,
    placesToGo:
      'Srikalahasti\nTirupati local\nKapila Theertham\nAlipiri area',
    routeStops: [
      {
        name: 'Srikalahasti',
        url: 'https://www.google.com/maps/search/?api=1&query=Srikalahasti',
      },
      {
        name: 'Kapila Theertham',
        url: 'https://www.google.com/maps/search/?api=1&query=Kapila%20Theertham',
      },
    ],
    thingsToDo:
      'Short day before final ride\ntemple/local evening\npack neatly for home stretch',
    specialityFood:
      'Tirupati laddu\nAndhra meals\nfilter coffee',
    beforeGoing:
      'If visiting Tirumala, book darshan separately\nkeep final-day start simple',
  }),
  buildDayPlan({
    id: 'day-36',
    dayLabel: 'Day 36',
    date: '09-01-2027',
    status: 'PENDING',
    title: 'Tirupati to Bangalore',
    startPoint: 'Tirupati',
    endPoint: 'Bangalore',
    distance: '250 km',
    placesToStay: 'Home',
    routeMapLink:
      'https://www.google.com/maps/dir/?api=1&origin=Tirupati&destination=Bangalore&travelmode=driving&waypoints=Chittoor%7CKolar',
    startLat: 13.6288,
    startLng: 79.4192,
    overnightLat: 12.9716,
    overnightLng: 77.5946,
    placesToGo: 'Chittoor\nKolar\noptional Nandi Hills only if fresh',
    routeStops: [
      {
        name: 'Chittoor',
        url: 'https://www.google.com/maps/search/?api=1&query=Chittoor',
      },
      {
        name: 'Kolar',
        url: 'https://www.google.com/maps/search/?api=1&query=Kolar',
      },
    ],
    thingsToDo:
      'Final ride home\nstart early\nkeep breaks boring and safe\nunpack and rest',
    specialityFood: 'Kolar breakfast\nfilter coffee\nhome food',
    beforeGoing:
      'Do not rush the final day\nmessage family with ETA\npost-trip bike wash/service',
  }),
];
