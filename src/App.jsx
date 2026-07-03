import { useEffect, useMemo, useState } from 'react';
import {
  CircleMarker,
  MapContainer,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  initialDailyPlan,
  packingChecklist as defaultPackingChecklist,
  planningChecklist as defaultPlanningChecklist,
  starterExpenseCategories,
  starterExpenses,
  starterNotes,
  starterShoppingList,
  tripMeta,
} from './data/tripData';

const dailyPlanStorageKey = 'tripflow-daily-plan-v2';
const planningStorageKey = 'tripflow-planning';
const packingStorageKey = 'tripflow-packing';
const expensesStorageKey = 'tripflow-expenses';
const notesStorageKey = 'tripflow-notes';
const shoppingStorageKey = 'tripflow-shopping';
const categoriesStorageKey = 'tripflow-expense-categories';
const activePageStorageKey = 'tripflow-active-page';
const selectedDayStorageKey = 'tripflow-selected-day-v2';
const plannerDayStorageKey = 'tripflow-planner-day-v2';

function loadStoredValue(key, fallback) {
  const savedValue = window.localStorage.getItem(key);

  if (!savedValue) {
    return fallback;
  }

  try {
    return JSON.parse(savedValue);
  } catch {
    return fallback;
  }
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: tripMeta.currency,
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

function formatCompactCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(amount || 0);
}

function normalizeMinorStop(stop, index) {
  return {
    id: stop.id || `minor-${Date.now()}-${index}`,
    name: stop.name || '',
    url: stop.url || '',
    lat: stop.lat ?? '',
    lng: stop.lng ?? '',
    note: stop.note || '',
    distanceFromStart: stop.distanceFromStart || '',
  };
}

function normalizeDailyPlan(days) {
  return days.map((day, index) => ({
    ...day,
    id: day.id || `day-${index + 1}`,
    dayLabel: day.dayLabel || `Day ${index + 1}`,
    date: day.date || '',
    status: day.status || 'PENDING',
    title: day.title || '',
    startPoint: day.startPoint || '',
    endPoint: day.endPoint || '',
    distance: day.distance || '',
    placesToStay: day.placesToStay || '',
    placesToGo: day.placesToGo || '',
    route: day.route || '',
    routeMapLink: day.routeMapLink || '',
    thingsToDo: day.thingsToDo || '',
    specialityFood: day.specialityFood || '',
    beforeGoing: day.beforeGoing || '',
    visited: Boolean(day.visited),
    startLat: day.startLat ?? '',
    startLng: day.startLng ?? '',
    overnightLat: day.overnightLat ?? '',
    overnightLng: day.overnightLng ?? '',
    minorStops: (day.minorStops || []).map(normalizeMinorStop),
  }));
}

function getPreferredPlannerDayId(days) {
  return days.find((day) => !day.visited)?.id || days[0]?.id || '';
}

function createDayTemplate(dayNumber) {
  return {
    id: `day-${Date.now()}-${dayNumber}`,
    dayLabel: `Day ${dayNumber}`,
    date: '',
    status: 'PENDING',
    title: '',
    startPoint: '',
    endPoint: '',
    distance: '',
    placesToStay: '',
    placesToGo: '',
    route: '',
    routeMapLink: '',
    thingsToDo: '',
    specialityFood: '',
    beforeGoing: '',
    visited: false,
    startLat: '',
    startLng: '',
    overnightLat: '',
    overnightLng: '',
    minorStops: [],
  };
}

function createChecklistItem(prefix) {
  return {
    id: `${prefix}-${Date.now()}`,
    label: '',
    done: false,
  };
}

function splitLines(value) {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseRouteLinks(value) {
  return splitLines(value).map((line) => {
    const [urlPart, labelPart] = line.split('|');
    const url = urlPart?.trim() || '';
    const label = labelPart?.trim() || url;

    return { url, label };
  });
}

function MapViewport({ coordinates }) {
  const map = useMap();

  useEffect(() => {
    if (!coordinates.length) {
      return;
    }

    map.fitBounds(coordinates, { padding: [32, 32] });
  }, [coordinates, map]);

  return null;
}

function RouteMap({ title, markers, coordinates, lineColor }) {
  const safeCoordinates = coordinates.filter(
    (point) => Number.isFinite(point[0]) && Number.isFinite(point[1]),
  );
  const fallbackCenter = safeCoordinates[0] || [12.9716, 77.5946];

  return (
    <section className="panel">
      <div className="section-heading compact-heading">
        <h2>{title}</h2>
        <span className="badge">{markers.length} markers</span>
      </div>

      <div className="map-frame">
        <MapContainer
          center={fallbackCenter}
          zoom={6}
          scrollWheelZoom={true}
          className="map"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapViewport coordinates={safeCoordinates} />
          {safeCoordinates.length > 1 ? (
            <Polyline positions={safeCoordinates} pathOptions={{ color: lineColor, weight: 4 }} />
          ) : null}
          {markers.map((marker) => (
            <CircleMarker
              key={marker.id}
              center={[marker.lat, marker.lng]}
              radius={marker.visited ? 9 : 7}
              pathOptions={{
                color: marker.visited ? '#0f0f10' : '#5e5e63',
                fillColor: marker.visited ? '#0f0f10' : '#b9b9bf',
                fillOpacity: 1,
                weight: 2,
              }}
            >
              <Popup>
                <strong>{marker.label}</strong>
                <br />
                {marker.description}
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </section>
  );
}

function ChecklistCard({ title, items, onToggle }) {
  const doneCount = items.filter((item) => item.done).length;

  return (
    <section className="panel">
      <div className="section-heading compact-heading">
        <h2>{title}</h2>
        <span className="badge">
          {doneCount}/{items.length}
        </span>
      </div>

      <div className="checklist">
        {items.map((item) => (
          <label className="check-item" key={item.id}>
            <input
              type="checkbox"
              checked={item.done}
              onChange={() => onToggle(item.id)}
            />
            <span>{item.label}</span>
          </label>
        ))}
      </div>
    </section>
  );
}

function App() {
  const [activePage, setActivePage] = useState(() =>
    loadStoredValue(activePageStorageKey, 'planner'),
  );
  const [dailyPlan, setDailyPlan] = useState(() =>
    normalizeDailyPlan(loadStoredValue(dailyPlanStorageKey, initialDailyPlan)),
  );
  const [selectedDayId, setSelectedDayId] = useState(() =>
    loadStoredValue(selectedDayStorageKey, initialDailyPlan[0]?.id || ''),
  );
  const [plannerDayId, setPlannerDayId] = useState(() =>
    loadStoredValue(plannerDayStorageKey, getPreferredPlannerDayId(normalizeDailyPlan(initialDailyPlan))),
  );
  const [planningTasks, setPlanningTasks] = useState(() =>
    loadStoredValue(planningStorageKey, defaultPlanningChecklist),
  );
  const [packingChecklist, setPackingChecklist] = useState(() =>
    loadStoredValue(packingStorageKey, defaultPackingChecklist),
  );
  const [expenses, setExpenses] = useState(() =>
    loadStoredValue(expensesStorageKey, starterExpenses),
  );
  const [shoppingList, setShoppingList] = useState(() =>
    loadStoredValue(shoppingStorageKey, starterShoppingList),
  );
  const [expenseCategories, setExpenseCategories] = useState(() =>
    loadStoredValue(categoriesStorageKey, starterExpenseCategories),
  );
  const [notes, setNotes] = useState(() =>
    loadStoredValue(notesStorageKey, starterNotes),
  );
  const [expenseDraft, setExpenseDraft] = useState({
    title: '',
    category: starterExpenseCategories[0] || 'Other',
    place: '',
    amount: '',
    date: '',
  });
  const [shoppingDraft, setShoppingDraft] = useState({
    item: '',
    link: '',
    price: '',
  });
  const [categoryDraft, setCategoryDraft] = useState('');

  useEffect(() => {
    window.localStorage.setItem(activePageStorageKey, JSON.stringify(activePage));
  }, [activePage]);

  useEffect(() => {
    window.localStorage.setItem(dailyPlanStorageKey, JSON.stringify(dailyPlan));
  }, [dailyPlan]);

  useEffect(() => {
    window.localStorage.setItem(selectedDayStorageKey, JSON.stringify(selectedDayId));
  }, [selectedDayId]);

  useEffect(() => {
    window.localStorage.setItem(plannerDayStorageKey, JSON.stringify(plannerDayId));
  }, [plannerDayId]);

  useEffect(() => {
    if (!dailyPlan.find((day) => day.id === selectedDayId)) {
      setSelectedDayId(dailyPlan[0]?.id || '');
    }
  }, [dailyPlan, selectedDayId]);

  useEffect(() => {
    if (!dailyPlan.find((day) => day.id === plannerDayId)) {
      setPlannerDayId(getPreferredPlannerDayId(dailyPlan));
    }
  }, [dailyPlan, plannerDayId]);

  useEffect(() => {
    window.localStorage.setItem(planningStorageKey, JSON.stringify(planningTasks));
  }, [planningTasks]);

  useEffect(() => {
    window.localStorage.setItem(packingStorageKey, JSON.stringify(packingChecklist));
  }, [packingChecklist]);

  useEffect(() => {
    window.localStorage.setItem(expensesStorageKey, JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    window.localStorage.setItem(shoppingStorageKey, JSON.stringify(shoppingList));
  }, [shoppingList]);

  useEffect(() => {
    window.localStorage.setItem(categoriesStorageKey, JSON.stringify(expenseCategories));
  }, [expenseCategories]);

  useEffect(() => {
    window.localStorage.setItem(notesStorageKey, JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    if (!expenseCategories.includes(expenseDraft.category)) {
      setExpenseDraft((current) => ({
        ...current,
        category: expenseCategories[0] || 'Other',
      }));
    }
  }, [expenseCategories, expenseDraft.category]);

  const selectedDay =
    dailyPlan.find((day) => day.id === selectedDayId) || dailyPlan[0] || null;
  const plannerDay =
    dailyPlan.find((day) => day.id === plannerDayId) ||
    dailyPlan.find((day) => !day.visited) ||
    dailyPlan[0] ||
    null;
  const plannerDayIndex = plannerDay
    ? dailyPlan.findIndex((day) => day.id === plannerDay.id)
    : -1;

  const visitedCount = dailyPlan.filter((day) => day.visited).length;
  const totalMinorStops = dailyPlan.reduce(
    (sum, day) => sum + day.minorStops.length,
    0,
  );
  const totalExpense = expenses.reduce((sum, item) => sum + Number(item.amount), 0);
  const shoppingTotal = shoppingList.reduce(
    (sum, item) => sum + Number(item.price || 0),
    0,
  );
  const boughtCount = shoppingList.filter((item) => item.status === 'bought').length;
  const completionPercent = dailyPlan.length
    ? Math.round((visitedCount / dailyPlan.length) * 100)
    : 0;
  const remainingBudget = tripMeta.targetBudget - totalExpense - shoppingTotal;

  const categoryTotals = useMemo(
    () =>
      expenseCategories.map((category) => ({
        category,
        total: expenses
          .filter((item) => item.category === category)
          .reduce((sum, item) => sum + Number(item.amount), 0),
      })),
    [expenseCategories, expenses],
  );
  const recentExpenses = expenses.slice(0, 6);
  const maxCategoryTotal = Math.max(...categoryTotals.map((item) => item.total), 0);
  const chartMax = maxCategoryTotal > 0 ? maxCategoryTotal : 1;
  const chartTicks = [4, 3, 2, 1, 0].map((step) => Math.round((chartMax * step) / 4));

  const majorMarkers = useMemo(
    () =>
      dailyPlan
        .filter(
          (day) =>
            Number.isFinite(Number(day.overnightLat)) &&
            Number.isFinite(Number(day.overnightLng)),
        )
        .map((day) => ({
          id: day.id,
          label: `${day.dayLabel}: ${day.endPoint || 'End Stop'}`,
          description: `${day.startPoint || 'Start'} to ${day.endPoint || 'End'}`,
          lat: Number(day.overnightLat),
          lng: Number(day.overnightLng),
          visited: day.visited,
        })),
    [dailyPlan],
  );

  const minorMarkers = useMemo(
    () =>
      dailyPlan.flatMap((day) =>
        day.minorStops
          .filter(
            (stop) =>
              Number.isFinite(Number(stop.lat)) && Number.isFinite(Number(stop.lng)),
          )
          .map((stop) => ({
            id: stop.id,
            label: `${day.dayLabel}: ${stop.name || 'Stop'}`,
            description: stop.note || day.endPoint || '',
            lat: Number(stop.lat),
            lng: Number(stop.lng),
            visited: day.visited,
          })),
      ),
    [dailyPlan],
  );

  const majorCoordinates = majorMarkers.map((marker) => [marker.lat, marker.lng]);
  const minorCoordinates = minorMarkers.map((marker) => [marker.lat, marker.lng]);

  const toggleChecklist = (setItems, id) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item,
      ),
    );
  };

  const updateChecklistLabel = (setItems, id, label) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, label } : item,
      ),
    );
  };

  const addChecklistItem = (setItems, prefix) => {
    setItems((currentItems) => [...currentItems, createChecklistItem(prefix)]);
  };

  const removeChecklistItem = (setItems, id) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id));
  };

  const updateDayField = (dayId, field, value) => {
    setDailyPlan((currentDays) =>
      currentDays.map((day) =>
        day.id === dayId ? { ...day, [field]: value } : day,
      ),
    );
  };

  const toggleVisited = (dayId) => {
    setDailyPlan((currentDays) =>
      currentDays.map((day) =>
        day.id === dayId ? { ...day, visited: !day.visited } : day,
      ),
    );
  };

  const addDay = () => {
    const newDay = createDayTemplate(dailyPlan.length + 1);
    setDailyPlan((currentDays) => [...currentDays, newDay]);
    setSelectedDayId(newDay.id);
    setPlannerDayId(newDay.id);
  };

  const removeDay = (dayId) => {
    setDailyPlan((currentDays) => currentDays.filter((day) => day.id !== dayId));
  };

  const addMinorStop = (dayId) => {
    setDailyPlan((currentDays) =>
      currentDays.map((day) =>
        day.id === dayId
          ? {
              ...day,
              minorStops: [
                ...day.minorStops,
                {
                  id: `minor-${Date.now()}`,
                  name: '',
                  url: '',
                  lat: '',
                  lng: '',
                  note: '',
                  distanceFromStart: '',
                },
              ],
            }
          : day,
      ),
    );
  };

  const updateMinorStop = (dayId, stopId, field, value) => {
    setDailyPlan((currentDays) =>
      currentDays.map((day) =>
        day.id === dayId
          ? {
              ...day,
              minorStops: day.minorStops.map((stop) =>
                stop.id === stopId ? { ...stop, [field]: value } : stop,
              ),
            }
          : day,
      ),
    );
  };

  const removeMinorStop = (dayId, stopId) => {
    setDailyPlan((currentDays) =>
      currentDays.map((day) =>
        day.id === dayId
          ? {
              ...day,
              minorStops: day.minorStops.filter((stop) => stop.id !== stopId),
            }
          : day,
      ),
    );
  };

  const handleExpenseChange = (event) => {
    const { name, value } = event.target;
    setExpenseDraft((current) => ({ ...current, [name]: value }));
  };

  const handleExpenseSubmit = (event) => {
    event.preventDefault();

    if (!expenseDraft.title.trim() || !expenseDraft.amount) {
      return;
    }

    setExpenses((currentExpenses) => [
      {
        id: `expense-${Date.now()}`,
        title: expenseDraft.title.trim(),
        category: expenseDraft.category,
        place: expenseDraft.place.trim() || 'Trip',
        amount: Number(expenseDraft.amount),
        date: expenseDraft.date || new Date().toISOString().slice(0, 10),
      },
      ...currentExpenses,
    ]);

    setExpenseDraft((current) => ({
      ...current,
      title: '',
      place: '',
      amount: '',
      date: '',
    }));
  };

  const deleteExpense = (id) => {
    setExpenses((currentExpenses) =>
      currentExpenses.filter((item) => item.id !== id),
    );
  };

  const handleShoppingChange = (event) => {
    const { name, value } = event.target;
    setShoppingDraft((current) => ({ ...current, [name]: value }));
  };

  const handleShoppingSubmit = (event) => {
    event.preventDefault();

    if (!shoppingDraft.item.trim()) {
      return;
    }

    setShoppingList((currentItems) => [
      {
        id: `shop-${Date.now()}`,
        item: shoppingDraft.item.trim(),
        link: shoppingDraft.link.trim(),
        price: Number(shoppingDraft.price || 0),
        status: 'pending',
      },
      ...currentItems,
    ]);

    setShoppingDraft({
      item: '',
      link: '',
      price: '',
    });
  };

  const updateShoppingItem = (id, field, value) => {
    setShoppingList((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  };

  const toggleShoppingStatus = (id) => {
    setShoppingList((currentItems) =>
      currentItems.map((item) =>
        item.id === id
          ? { ...item, status: item.status === 'bought' ? 'pending' : 'bought' }
          : item,
      ),
    );
  };

  const deleteShoppingItem = (id) => {
    setShoppingList((currentItems) =>
      currentItems.filter((item) => item.id !== id),
    );
  };

  const addExpenseCategory = () => {
    const trimmedValue = categoryDraft.trim();

    if (!trimmedValue || expenseCategories.includes(trimmedValue)) {
      return;
    }

    setExpenseCategories((currentCategories) => [...currentCategories, trimmedValue]);
    setCategoryDraft('');
  };

  const removeExpenseCategory = (categoryToRemove) => {
    setExpenseCategories((currentCategories) =>
      currentCategories.filter((category) => category !== categoryToRemove),
    );
    setExpenses((currentExpenses) =>
      currentExpenses.map((item) =>
        item.category === categoryToRemove ? { ...item, category: 'Other' } : item,
      ),
    );
  };

  const goToPlannerDay = (direction) => {
    const nextIndex = plannerDayIndex + direction;

    if (nextIndex < 0 || nextIndex >= dailyPlan.length) {
      return;
    }

    setPlannerDayId(dailyPlan[nextIndex].id);
  };

  const openRouteMap = (url) => {
    if (!url) {
      return;
    }

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="app-shell">
      <header className="hero panel">
        <div className="hero-header-row">
          <div className="hero-copy">
            <p className="eyebrow">Field Operations</p>
            <h1>First Solo Bike Road Trip Planner</h1>
          </div>

          <div className="hero-status-cluster">
            <span className="system-pill">
              <span className="status-dot" />
              Route system active
            </span>
            <span className="system-pill alt">
              <span className="status-dot alt" />
              {activePage === 'planner' ? 'Planner view online' : 'Settings link active'}
            </span>
          </div>
        </div>

        <div className="hero-divider" />

        <div className="hero-bottom">
          <div className="stat-grid">
            <article className="stat-card">
              <span>Visited days</span>
              <strong>{completionPercent}%</strong>
              <small>
                {visitedCount} of {dailyPlan.length} marked complete
              </small>
            </article>
            <article className="stat-card">
              <span>Small stops</span>
              <strong>{totalMinorStops}</strong>
              <small>Editable minor route markers</small>
            </article>
            <article className="stat-card">
              <span>Trip spend</span>
              <strong>{formatCurrency(totalExpense)}</strong>
              <small>Expenses logged so far</small>
            </article>
            <article className="stat-card">
              <span>Need to buy</span>
              <strong>
                {boughtCount}/{shoppingList.length}
              </strong>
              <small>{formatCurrency(shoppingTotal)} current buy list value</small>
            </article>
          </div>

          <div className="hero-side">
            <div className="page-switcher">
              <button
                type="button"
                className={`status-toggle ${activePage === 'planner' ? 'active' : ''}`}
                onClick={() => setActivePage('planner')}
              >
                Planner
              </button>
              <button
                type="button"
                className={`status-toggle ${activePage === 'settings' ? 'active' : ''}`}
                onClick={() => setActivePage('settings')}
              >
                Settings
              </button>
            </div>
          </div>
        </div>
      </header>

      {activePage === 'planner' ? (
        <main className="content-grid">
          <RouteMap
            title="Final stop of each day"
            markers={majorMarkers}
            coordinates={majorCoordinates}
            lineColor="#4c4c52"
          />

          <RouteMap
            title="All smaller route stops"
            markers={minorMarkers.length ? minorMarkers : majorMarkers}
            coordinates={minorMarkers.length ? minorCoordinates : majorCoordinates}
            lineColor="#8a8a92"
          />

          <ChecklistCard
            title="Planning checklist"
            items={planningTasks}
            onToggle={(id) => toggleChecklist(setPlanningTasks, id)}
          />

          <ChecklistCard
            title="Packing checklist"
            items={packingChecklist}
            onToggle={(id) => toggleChecklist(setPackingChecklist, id)}
          />

          <section className="panel day-panel">
            <div className="section-heading compact-heading">
              <h2>Detailed route plan</h2>
              <span className="badge">
                {plannerDayIndex >= 0 ? `${plannerDayIndex + 1} / ${dailyPlan.length}` : '0 / 0'}
              </span>
            </div>

            {plannerDay ? (
              <>
                <div className="planner-nav">
                  <button
                    type="button"
                    className="nav-arrow"
                    onClick={() => goToPlannerDay(-1)}
                    disabled={plannerDayIndex <= 0}
                    aria-label="Previous day"
                  >
                    &lt;
                  </button>
                  <div className="planner-nav-copy">
                    <span>Showing</span>
                    <strong>{plannerDay.dayLabel}</strong>
                  </div>
                  <button
                    type="button"
                    className="nav-arrow"
                    onClick={() => goToPlannerDay(1)}
                    disabled={plannerDayIndex >= dailyPlan.length - 1}
                    aria-label="Next day"
                  >
                    &gt;
                  </button>
                </div>

                <div className="day-list">
                  <article className="day-card">
                    <div className="day-card-top">
                      <div>
                        <p className="day-label">{plannerDay.dayLabel}</p>
                        <h3>
                          {plannerDay.startPoint || 'Start'} to {plannerDay.endPoint || 'End'}
                        </h3>
                      </div>
                      <div className="day-actions">
                        <button
                          type="button"
                          className={`status-toggle ${plannerDay.visited ? 'active' : ''}`}
                          onClick={() => toggleVisited(plannerDay.id)}
                        >
                          {plannerDay.visited ? 'Visited' : 'Pending'}
                        </button>
                        <button
                          type="button"
                          className="ghost-button"
                          onClick={() => openRouteMap(plannerDay.routeMapLink)}
                          disabled={!plannerDay.routeMapLink}
                        >
                          Open map
                        </button>
                      </div>
                    </div>

                    <div className="day-meta-grid">
                      <div className="meta-card">
                        <span>Start point</span>
                        <strong>{plannerDay.startPoint || '-'}</strong>
                      </div>
                      <div className="meta-card">
                        <span>End point</span>
                        <strong>{plannerDay.endPoint || '-'}</strong>
                      </div>
                      <div className="meta-card">
                        <span>Distance</span>
                        <strong>{plannerDay.distance || '-'}</strong>
                      </div>
                      <div className="meta-card">
                        <span>Places to stay</span>
                        <strong>{plannerDay.placesToStay || '-'}</strong>
                      </div>
                    </div>

                    <div className="route-strip">
                      <div className="route-stop route-stop-main">
                        <span className="route-stop-label">Start</span>
                        <strong>{plannerDay.startPoint || 'Start point'}</strong>
                      </div>
                      {plannerDay.minorStops.map((stop) => (
                        <div className="route-stop" key={stop.id}>
                          <span className="route-stop-label">
                            {stop.distanceFromStart || 'Distance not set'}
                          </span>
                          <strong>{stop.name || 'Stop'}</strong>
                        </div>
                      ))}
                      <div className="route-stop route-stop-main">
                        <span className="route-stop-label">End</span>
                        <strong>{plannerDay.endPoint || 'End point'}</strong>
                      </div>
                    </div>

                    <div className="detail-grid">
                      <div className="detail-block">
                        <h4>Places to go</h4>
                        <ul className="plain-list">
                          {splitLines(plannerDay.placesToGo).length
                            ? splitLines(plannerDay.placesToGo).map((item) => (
                                <li key={item}>{item}</li>
                              ))
                            : <li>-</li>}
                        </ul>
                      </div>

                      <div className="detail-block">
                        <h4>Route links</h4>
                        <ul className="plain-list">
                          {parseRouteLinks(plannerDay.route).length
                            ? parseRouteLinks(plannerDay.route).map((item) => (
                                <li key={`${plannerDay.id}-${item.url}-${item.label}`}>
                                  {item.url ? (
                                    <a href={item.url} target="_blank" rel="noreferrer">
                                      {item.label}
                                    </a>
                                  ) : (
                                    item.label
                                  )}
                                </li>
                              ))
                            : <li>-</li>}
                        </ul>
                      </div>

                      <div className="detail-block">
                        <h4>Things to do</h4>
                        <ul className="plain-list">
                          {splitLines(plannerDay.thingsToDo).length
                            ? splitLines(plannerDay.thingsToDo).map((item) => (
                                <li key={item}>{item}</li>
                              ))
                            : <li>-</li>}
                        </ul>
                      </div>

                      <div className="detail-block">
                        <h4>Speciality food</h4>
                        <ul className="plain-list">
                          {splitLines(plannerDay.specialityFood).length
                            ? splitLines(plannerDay.specialityFood).map((item) => (
                                <li key={item}>{item}</li>
                              ))
                            : <li>-</li>}
                        </ul>
                      </div>

                      <div className="detail-block">
                        <h4>Before you go</h4>
                        <ul className="plain-list">
                          {splitLines(plannerDay.beforeGoing).length
                            ? splitLines(plannerDay.beforeGoing).map((item) => (
                                <li key={item}>{item}</li>
                              ))
                            : <li>-</li>}
                        </ul>
                      </div>

                      <div className="detail-block">
                        <h4>Stops on the way</h4>
                        <ul className="plain-list">
                          {plannerDay.minorStops.length
                            ? plannerDay.minorStops.map((stop) => (
                                <li key={stop.id}>
                                  {stop.url ? (
                                    <a href={stop.url} target="_blank" rel="noreferrer">
                                      {stop.name || 'Stop'}
                                    </a>
                                  ) : (
                                    stop.name || 'Stop'
                                  )}
                                  {stop.distanceFromStart ? ` - ${stop.distanceFromStart}` : ''}
                                </li>
                              ))
                            : <li>-</li>}
                        </ul>
                      </div>
                    </div>
                  </article>
                </div>

                <div className="planner-nav planner-nav-bottom">
                  <button
                    type="button"
                    className="nav-arrow"
                    onClick={() => goToPlannerDay(-1)}
                    disabled={plannerDayIndex <= 0}
                    aria-label="Previous day"
                  >
                    &lt;
                  </button>
                  <button
                    type="button"
                    className="nav-arrow"
                    onClick={() => goToPlannerDay(1)}
                    disabled={plannerDayIndex >= dailyPlan.length - 1}
                    aria-label="Next day"
                  >
                    &gt;
                  </button>
                </div>
              </>
            ) : null}
          </section>

          <section className="panel budget-panel">
            <div className="section-heading compact-heading">
              <h2>Spending overview</h2>
              <span className="badge">{formatCurrency(remainingBudget)} left</span>
            </div>

            <div className="budget-grid">
              <article className="budget-card">
                <span>Target budget</span>
                <strong>{formatCurrency(tripMeta.targetBudget)}</strong>
              </article>
              <article className="budget-card">
                <span>Logged expenses</span>
                <strong>{formatCurrency(totalExpense)}</strong>
              </article>
              <article className="budget-card">
                <span>Buy list total</span>
                <strong>{formatCurrency(shoppingTotal)}</strong>
              </article>
              <article className="budget-card">
                <span>Estimated left</span>
                <strong>{formatCurrency(remainingBudget)}</strong>
              </article>
            </div>

            <div className="budget-layout">
              <div className="expense-quick-panel">
                <h3 className="subheading">Add spending</h3>
                <form className="expense-form main-expense-form" onSubmit={handleExpenseSubmit}>
                  <input
                    type="text"
                    name="title"
                    value={expenseDraft.title}
                    onChange={handleExpenseChange}
                    placeholder="Expense title"
                  />
                  <select
                    name="category"
                    value={expenseDraft.category}
                    onChange={handleExpenseChange}
                  >
                    {expenseCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    name="place"
                    value={expenseDraft.place}
                    onChange={handleExpenseChange}
                    placeholder="Place"
                  />
                  <input
                    type="number"
                    min="0"
                    name="amount"
                    value={expenseDraft.amount}
                    onChange={handleExpenseChange}
                    placeholder="Amount"
                  />
                  <input
                    type="date"
                    name="date"
                    value={expenseDraft.date}
                    onChange={handleExpenseChange}
                  />
                  <button type="submit" className="primary-button add-button">
                    Add
                  </button>
                </form>

                <div className="expense-card-grid">
                  {recentExpenses.map((expense) => (
                    <article className="expense-tile" key={expense.id}>
                      <div className="expense-tile-top">
                        <span>{expense.category}</span>
                        <strong>{formatCurrency(expense.amount)}</strong>
                      </div>
                      <h3>{expense.title}</h3>
                      <p>
                        {expense.place} - {expense.date}
                      </p>
                      <button
                        type="button"
                        className="ghost-button small-button"
                        onClick={() => deleteExpense(expense.id)}
                      >
                        Remove
                      </button>
                    </article>
                  ))}
                </div>
              </div>

              <div className="expense-chart-panel">
                <h3 className="subheading">Category breakdown</h3>
                <div className="column-chart">
                  <div className="chart-y-axis">
                    {chartTicks.map((tick) => (
                      <span key={tick}>{formatCompactCurrency(tick)}</span>
                    ))}
                  </div>
                  <div className="chart-plot">
                    <div className="chart-grid-lines">
                      {chartTicks.map((tick, index) => (
                        <div
                          className={`chart-grid-line ${index === chartTicks.length - 1 ? 'baseline' : ''}`}
                          key={`${tick}-${index}`}
                        />
                      ))}
                    </div>
                    <div className="chart-columns">
                      {categoryTotals.map((item) => (
                        <div className="chart-column-wrap" key={item.category}>
                          <span className="chart-value">{formatCompactCurrency(item.total)}</span>
                          <div className="chart-column-track">
                            <div
                              className="chart-column-fill"
                              style={{
                                height: `${(item.total / chartMax) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="chart-x-label">{item.category}</span>
                        </div>
                      ))}
                    </div>
                    <div className="chart-x-axis" />
                  </div>
                </div>
                <div className="chart-summary-grid">
                  {categoryTotals.map((item) => (
                    <div className="chart-summary-card" key={`${item.category}-summary`}>
                      <span>{item.category}</span>
                      <strong>{formatCurrency(item.total)}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </main>
      ) : (
        <main className="content-grid">
          <section className="panel settings-panel">
            <div className="settings-header">
              <h2>Settings</h2>
            </div>

            <div className="settings-stack">
              <div className="settings-topbar">
                <div className="day-selector">
                  {dailyPlan.map((day) => (
                    <button
                      type="button"
                      key={day.id}
                      className={`day-tab ${selectedDayId === day.id ? 'active' : ''}`}
                      onClick={() => setSelectedDayId(day.id)}
                    >
                      {day.dayLabel}
                    </button>
                  ))}
                </div>
                <button type="button" className="primary-button add-button" onClick={addDay}>
                  Add day
                </button>
              </div>

              {selectedDay ? (
                <section className="panel settings-subpanel current-day-panel">
                  <div className="section-heading compact-heading">
                    <div>
                      <h2>{selectedDay.dayLabel}</h2>
                      <p className="subcopy">
                        {selectedDay.startPoint || 'Start'} to {selectedDay.endPoint || 'End'}
                      </p>
                    </div>
                    <div className="editor-actions">
                      <button
                        type="button"
                        className={`status-toggle ${selectedDay.visited ? 'active' : ''}`}
                        onClick={() => toggleVisited(selectedDay.id)}
                      >
                        {selectedDay.visited ? 'Visited' : 'Pending'}
                      </button>
                      <button
                        type="button"
                        className="ghost-button"
                        onClick={() => removeDay(selectedDay.id)}
                      >
                        Remove day
                      </button>
                    </div>
                  </div>

                  <div className="settings-form-grid large-grid">
                    <input
                      type="text"
                      value={selectedDay.dayLabel}
                      placeholder="Day label"
                      onChange={(event) =>
                        updateDayField(selectedDay.id, 'dayLabel', event.target.value)
                      }
                    />
                    <input
                      type="text"
                      value={selectedDay.startPoint}
                      placeholder="Start point"
                      onChange={(event) =>
                        updateDayField(selectedDay.id, 'startPoint', event.target.value)
                      }
                    />
                    <input
                      type="text"
                      value={selectedDay.endPoint}
                      placeholder="End point"
                      onChange={(event) =>
                        updateDayField(selectedDay.id, 'endPoint', event.target.value)
                      }
                    />
                    <input
                      type="text"
                      value={selectedDay.distance}
                      placeholder="Distance"
                      onChange={(event) =>
                        updateDayField(selectedDay.id, 'distance', event.target.value)
                      }
                    />
                    <input
                      type="text"
                      value={selectedDay.placesToStay}
                      placeholder="Places to stay"
                      onChange={(event) =>
                        updateDayField(selectedDay.id, 'placesToStay', event.target.value)
                      }
                    />
                    <input
                      type="text"
                      value={selectedDay.routeMapLink}
                      placeholder="Route map link"
                      onChange={(event) =>
                        updateDayField(selectedDay.id, 'routeMapLink', event.target.value)
                      }
                    />
                    <input
                      type="number"
                      step="any"
                      value={selectedDay.startLat}
                      placeholder="Start latitude"
                      onChange={(event) =>
                        updateDayField(selectedDay.id, 'startLat', event.target.value)
                      }
                    />
                    <input
                      type="number"
                      step="any"
                      value={selectedDay.startLng}
                      placeholder="Start longitude"
                      onChange={(event) =>
                        updateDayField(selectedDay.id, 'startLng', event.target.value)
                      }
                    />
                    <input
                      type="number"
                      step="any"
                      value={selectedDay.overnightLat}
                      placeholder="End latitude"
                      onChange={(event) =>
                        updateDayField(selectedDay.id, 'overnightLat', event.target.value)
                      }
                    />
                    <input
                      type="number"
                      step="any"
                      value={selectedDay.overnightLng}
                      placeholder="End longitude"
                      onChange={(event) =>
                        updateDayField(selectedDay.id, 'overnightLng', event.target.value)
                      }
                    />
                  </div>

                  <div className="settings-form-stack">
                    <textarea
                      value={selectedDay.placesToGo}
                      placeholder="Places to go"
                      onChange={(event) =>
                        updateDayField(selectedDay.id, 'placesToGo', event.target.value)
                      }
                    />
                    <textarea
                      value={selectedDay.route}
                      placeholder="Route links"
                      onChange={(event) =>
                        updateDayField(selectedDay.id, 'route', event.target.value)
                      }
                    />
                    <textarea
                      value={selectedDay.thingsToDo}
                      placeholder="Things to do"
                      onChange={(event) =>
                        updateDayField(selectedDay.id, 'thingsToDo', event.target.value)
                      }
                    />
                    <textarea
                      value={selectedDay.specialityFood}
                      placeholder="Speciality food"
                      onChange={(event) =>
                        updateDayField(selectedDay.id, 'specialityFood', event.target.value)
                      }
                    />
                    <textarea
                      value={selectedDay.beforeGoing}
                      placeholder="Should do before going"
                      onChange={(event) =>
                        updateDayField(selectedDay.id, 'beforeGoing', event.target.value)
                      }
                    />
                  </div>

                  <div className="section-heading compact-heading inner-heading">
                    <h2>Stops on the way</h2>
                    <button
                      type="button"
                      className="primary-button add-button"
                      onClick={() => addMinorStop(selectedDay.id)}
                    >
                      Add stop
                    </button>
                  </div>

                  <div className="minor-stop-list">
                    {selectedDay.minorStops.map((stop) => (
                      <div className="minor-stop-card" key={stop.id}>
                        <div className="minor-stop-grid">
                          <input
                            type="text"
                            value={stop.name}
                            placeholder="Stop name"
                            onChange={(event) =>
                              updateMinorStop(selectedDay.id, stop.id, 'name', event.target.value)
                            }
                          />
                          <input
                            type="text"
                            value={stop.url}
                            placeholder="Google Maps link"
                            onChange={(event) =>
                              updateMinorStop(selectedDay.id, stop.id, 'url', event.target.value)
                            }
                          />
                          <input
                            type="text"
                            value={stop.distanceFromStart}
                            placeholder="Distance from start"
                            onChange={(event) =>
                              updateMinorStop(
                                selectedDay.id,
                                stop.id,
                                'distanceFromStart',
                                event.target.value,
                              )
                            }
                          />
                          <input
                            type="number"
                            step="any"
                            value={stop.lat}
                            placeholder="Latitude"
                            onChange={(event) =>
                              updateMinorStop(selectedDay.id, stop.id, 'lat', event.target.value)
                            }
                          />
                          <input
                            type="number"
                            step="any"
                            value={stop.lng}
                            placeholder="Longitude"
                            onChange={(event) =>
                              updateMinorStop(selectedDay.id, stop.id, 'lng', event.target.value)
                            }
                          />
                        </div>
                        <textarea
                          value={stop.note}
                          placeholder="Stop note"
                          onChange={(event) =>
                            updateMinorStop(selectedDay.id, stop.id, 'note', event.target.value)
                          }
                        />
                        <button
                          type="button"
                          className="ghost-button"
                          onClick={() => removeMinorStop(selectedDay.id, stop.id)}
                        >
                          Remove stop
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}

              <div className="settings-two-column">
                <section className="panel settings-subpanel">
                  <div className="section-heading compact-heading">
                    <h2>Planning checklist</h2>
                    <button
                      type="button"
                      className="primary-button add-button"
                      onClick={() => addChecklistItem(setPlanningTasks, 'planning')}
                    >
                      Add
                    </button>
                  </div>
                  <div className="settings-list">
                    {planningTasks.map((item) => (
                      <div className="settings-row" key={item.id}>
                        <input
                          type="text"
                          value={item.label}
                          placeholder="Checklist item"
                          onChange={(event) =>
                            updateChecklistLabel(
                              setPlanningTasks,
                              item.id,
                              event.target.value,
                            )
                          }
                        />
                        <button
                          type="button"
                          className="ghost-button"
                          onClick={() => removeChecklistItem(setPlanningTasks, item.id)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="panel settings-subpanel">
                  <div className="section-heading compact-heading">
                    <h2>Packing checklist</h2>
                    <button
                      type="button"
                      className="primary-button add-button"
                      onClick={() => addChecklistItem(setPackingChecklist, 'packing')}
                    >
                      Add
                    </button>
                  </div>
                  <div className="settings-list">
                    {packingChecklist.map((item) => (
                      <div className="settings-row" key={item.id}>
                        <input
                          type="text"
                          value={item.label}
                          placeholder="Checklist item"
                          onChange={(event) =>
                            updateChecklistLabel(
                              setPackingChecklist,
                              item.id,
                              event.target.value,
                            )
                          }
                        />
                        <button
                          type="button"
                          className="ghost-button"
                          onClick={() => removeChecklistItem(setPackingChecklist, item.id)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <div className="settings-two-column">
                <section className="panel settings-subpanel">
                  <div className="section-heading compact-heading">
                    <h2>Expense categories</h2>
                  </div>

                  <div className="settings-row add-row">
                    <input
                      type="text"
                      value={categoryDraft}
                      placeholder="New category"
                      onChange={(event) => setCategoryDraft(event.target.value)}
                    />
                    <button
                      type="button"
                      className="primary-button add-button"
                      onClick={addExpenseCategory}
                    >
                      Add
                    </button>
                  </div>

                  <div className="compact-category-list">
                    {expenseCategories.map((category) => (
                      <div className="compact-category-item" key={category}>
                        <span>{category}</span>
                        <button
                          type="button"
                          className="ghost-button small-button"
                          onClick={() => removeExpenseCategory(category)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="panel settings-subpanel">
                  <div className="section-heading compact-heading">
                    <h2>Expenses</h2>
                  </div>

                  <form className="expense-form" onSubmit={handleExpenseSubmit}>
                    <input
                      type="text"
                      name="title"
                      value={expenseDraft.title}
                      onChange={handleExpenseChange}
                      placeholder="Expense title"
                    />
                    <select
                      name="category"
                      value={expenseDraft.category}
                      onChange={handleExpenseChange}
                    >
                      {expenseCategories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      name="place"
                      value={expenseDraft.place}
                      onChange={handleExpenseChange}
                      placeholder="Place"
                    />
                    <input
                      type="number"
                      min="0"
                      name="amount"
                      value={expenseDraft.amount}
                      onChange={handleExpenseChange}
                      placeholder="Amount"
                    />
                    <input
                      type="date"
                      name="date"
                      value={expenseDraft.date}
                      onChange={handleExpenseChange}
                    />
                    <button type="submit" className="primary-button add-button">
                      Add
                    </button>
                  </form>

                  <div className="expense-list">
                    {expenses.map((expense) => (
                      <article className="expense-card" key={expense.id}>
                        <div>
                          <h3>{expense.title}</h3>
                          <p>
                            {expense.category} - {expense.place} - {expense.date}
                          </p>
                        </div>
                        <div className="expense-actions">
                          <strong>{formatCurrency(expense.amount)}</strong>
                          <button
                            type="button"
                            className="ghost-button"
                            onClick={() => deleteExpense(expense.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              </div>

              <div className="settings-two-column">
                <section className="panel settings-subpanel">
                  <div className="section-heading compact-heading">
                    <h2>Things to buy</h2>
                  </div>

                  <form className="shopping-form" onSubmit={handleShoppingSubmit}>
                    <input
                      type="text"
                      name="item"
                      value={shoppingDraft.item}
                      onChange={handleShoppingChange}
                      placeholder="Item"
                    />
                    <input
                      type="text"
                      name="link"
                      value={shoppingDraft.link}
                      onChange={handleShoppingChange}
                      placeholder="Product link"
                    />
                    <input
                      type="number"
                      min="0"
                      name="price"
                      value={shoppingDraft.price}
                      onChange={handleShoppingChange}
                      placeholder="Price"
                    />
                    <button type="submit" className="primary-button add-button">
                      Add
                    </button>
                  </form>

                  <div className="settings-list">
                    {shoppingList.map((item) => (
                      <div className="settings-card" key={item.id}>
                        <div className="settings-row">
                          <input
                            type="text"
                            value={item.item}
                            placeholder="Item"
                            onChange={(event) =>
                              updateShoppingItem(item.id, 'item', event.target.value)
                            }
                          />
                          <input
                            type="number"
                            min="0"
                            value={item.price}
                            placeholder="Price"
                            onChange={(event) =>
                              updateShoppingItem(
                                item.id,
                                'price',
                                Number(event.target.value || 0),
                              )
                            }
                          />
                        </div>
                        <input
                          type="text"
                          value={item.link}
                          placeholder="Product link"
                          onChange={(event) =>
                            updateShoppingItem(item.id, 'link', event.target.value)
                          }
                        />
                        <div className="settings-row">
                          <button
                            type="button"
                            className={`status-toggle ${item.status === 'bought' ? 'active' : ''}`}
                            onClick={() => toggleShoppingStatus(item.id)}
                          >
                            {item.status === 'bought' ? 'Bought' : 'Pending'}
                          </button>
                          <button
                            type="button"
                            className="ghost-button"
                            onClick={() => deleteShoppingItem(item.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="panel settings-subpanel">
                  <div className="section-heading compact-heading">
                    <h2>Notes</h2>
                  </div>

                  <textarea
                    className="notes-box"
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    placeholder="Notes, reminders, timings, permits, and route thoughts..."
                  />
                </section>
              </div>
            </div>
          </section>
        </main>
      )}
    </div>
  );
}

export default App;
