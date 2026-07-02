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
  starterExpenses,
  starterNotes,
  starterShoppingList,
  tripMeta,
} from './data/tripData';

const dailyPlanStorageKey = 'tripflow-daily-plan';
const planningStorageKey = 'tripflow-planning';
const packingStorageKey = 'tripflow-packing';
const expensesStorageKey = 'tripflow-expenses';
const notesStorageKey = 'tripflow-notes';
const shoppingStorageKey = 'tripflow-shopping';

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

function createDayTemplate(dayNumber) {
  return {
    id: `day-${Date.now()}-${dayNumber}`,
    dayLabel: `Day ${dayNumber}`,
    startPoint: '',
    endPoint: '',
    distance: '',
    placesToStay: '',
    placesToGo: '',
    route: '',
    thingsToDo: '',
    specialityFood: '',
    beforeGoing: '',
    visited: false,
    overnightLat: '',
    overnightLng: '',
    minorStops: [],
  };
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

function ChecklistCard({ title, items, onToggle }) {
  const doneCount = items.filter((item) => item.done).length;

  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Checklist</p>
          <h2>{title}</h2>
        </div>
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

function RouteMap({ title, eyebrow, description, coordinates, markers, lineColor }) {
  const safeCoordinates = coordinates.filter(
    (point) => Number.isFinite(point[0]) && Number.isFinite(point[1]),
  );

  const fallbackCenter = safeCoordinates[0] || [12.9716, 77.5946];

  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
        </div>
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
      <p className="map-note">{description}</p>
    </section>
  );
}

function App() {
  const [dailyPlan, setDailyPlan] = useState(() =>
    loadStoredValue(dailyPlanStorageKey, initialDailyPlan),
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
  const [notes, setNotes] = useState(() =>
    loadStoredValue(notesStorageKey, starterNotes),
  );
  const [expenseDraft, setExpenseDraft] = useState({
    title: '',
    category: 'Fuel',
    place: '',
    amount: '',
    date: '',
  });
  const [shoppingDraft, setShoppingDraft] = useState({
    item: '',
    link: '',
    price: '',
  });

  useEffect(() => {
    window.localStorage.setItem(dailyPlanStorageKey, JSON.stringify(dailyPlan));
  }, [dailyPlan]);

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
    window.localStorage.setItem(notesStorageKey, JSON.stringify(notes));
  }, [notes]);

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
            label: `${day.dayLabel}: ${stop.name || 'Minor Stop'}`,
            description: stop.note || day.endPoint || '',
            lat: Number(stop.lat),
            lng: Number(stop.lng),
            visited: day.visited,
          })),
      ),
    [dailyPlan],
  );

  const majorCoordinates = majorMarkers.map((marker) => [marker.lat, marker.lng]);
  const allCoordinates = [...majorCoordinates, ...minorMarkers.map((marker) => [marker.lat, marker.lng])];

  const toggleChecklist = (setItems, id) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item,
      ),
    );
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
    setDailyPlan((currentDays) => [
      ...currentDays,
      createDayTemplate(currentDays.length + 1),
    ]);
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

    setExpenseDraft({
      title: '',
      category: expenseDraft.category,
      place: '',
      amount: '',
      date: '',
    });
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

  const toggleShoppingStatus = (id) => {
    setShoppingList((currentItems) =>
      currentItems.map((item) =>
        item.id === id
          ? {
              ...item,
              status: item.status === 'bought' ? 'pending' : 'bought',
            }
          : item,
      ),
    );
  };

  const deleteShoppingItem = (id) => {
    setShoppingList((currentItems) =>
      currentItems.filter((item) => item.id !== id),
    );
  };

  return (
    <div className="app-shell">
      <header className="hero panel">
        <div className="hero-copy">
          <p className="eyebrow">Final custom trip planner</p>
          <h1>{tripMeta.tripName}</h1>
          <p className="hero-text">
            A clean editable planner where your day table, end-of-day stops,
            smaller route stops, shopping links, expenses, and visited status all
            live in one place.
          </p>
          <div className="hero-meta">
            <span>{tripMeta.dateRange}</span>
            <span>{tripMeta.startLocation}</span>
            <span>{dailyPlan.length} days planned</span>
          </div>
        </div>

        <div className="hero-side">
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
        </div>
      </header>

      <main className="content-grid">
        <RouteMap
          eyebrow="Map one"
          title="Final stop of each day"
          description="This map tracks the end point for every day. Edit the end point name and overnight coordinates in the stop editor below."
          coordinates={majorCoordinates}
          markers={majorMarkers}
          lineColor="#4c4c52"
        />

        <RouteMap
          eyebrow="Map two"
          title="All smaller route stops"
          description="This map includes the smaller checkpoints, sightseeing points, and route detours you add for each day."
          coordinates={allCoordinates}
          markers={minorMarkers.length ? minorMarkers : majorMarkers}
          lineColor="#8a8a92"
        />

        <section className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Trip focus</p>
              <h2>What this planner now supports</h2>
            </div>
          </div>
          <div className="pill-row">
            {tripMeta.highlights.map((highlight) => (
              <span className="pill" key={highlight}>
                {highlight}
              </span>
            ))}
          </div>
          <p className="panel-copy">{tripMeta.themeNote}</p>
        </section>

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

        <section className="panel table-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Editable planner</p>
              <h2>Day-by-day route table</h2>
            </div>
            <button type="button" className="primary-button" onClick={addDay}>
              Add day
            </button>
          </div>

          <div className="table-wrap">
            <table className="planner-table">
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Start Point</th>
                  <th>End Point</th>
                  <th>Distance</th>
                  <th>Places to stay</th>
                  <th>Places to go</th>
                  <th>Route</th>
                  <th>Things to do</th>
                  <th>Speciality food</th>
                  <th>Should do before going</th>
                  <th>Done</th>
                </tr>
              </thead>
              <tbody>
                {dailyPlan.map((day) => (
                  <tr key={day.id}>
                    <td>
                      <textarea
                        value={day.dayLabel}
                        onChange={(event) =>
                          updateDayField(day.id, 'dayLabel', event.target.value)
                        }
                      />
                    </td>
                    <td>
                      <textarea
                        value={day.startPoint}
                        onChange={(event) =>
                          updateDayField(day.id, 'startPoint', event.target.value)
                        }
                      />
                    </td>
                    <td>
                      <textarea
                        value={day.endPoint}
                        onChange={(event) =>
                          updateDayField(day.id, 'endPoint', event.target.value)
                        }
                      />
                    </td>
                    <td>
                      <textarea
                        value={day.distance}
                        onChange={(event) =>
                          updateDayField(day.id, 'distance', event.target.value)
                        }
                      />
                    </td>
                    <td>
                      <textarea
                        value={day.placesToStay}
                        onChange={(event) =>
                          updateDayField(day.id, 'placesToStay', event.target.value)
                        }
                      />
                    </td>
                    <td>
                      <textarea
                        value={day.placesToGo}
                        onChange={(event) =>
                          updateDayField(day.id, 'placesToGo', event.target.value)
                        }
                      />
                    </td>
                    <td>
                      <textarea
                        value={day.route}
                        onChange={(event) =>
                          updateDayField(day.id, 'route', event.target.value)
                        }
                      />
                    </td>
                    <td>
                      <textarea
                        value={day.thingsToDo}
                        onChange={(event) =>
                          updateDayField(day.id, 'thingsToDo', event.target.value)
                        }
                      />
                    </td>
                    <td>
                      <textarea
                        value={day.specialityFood}
                        onChange={(event) =>
                          updateDayField(day.id, 'specialityFood', event.target.value)
                        }
                      />
                    </td>
                    <td>
                      <textarea
                        value={day.beforeGoing}
                        onChange={(event) =>
                          updateDayField(day.id, 'beforeGoing', event.target.value)
                        }
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        className={`status-toggle full-width ${day.visited ? 'active' : ''}`}
                        onClick={() => toggleVisited(day.id)}
                      >
                        {day.visited ? 'Visited' : 'Pending'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="panel editor-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Map stop editor</p>
              <h2>Edit final stops and smaller stops</h2>
            </div>
          </div>

          <div className="editor-list">
            {dailyPlan.map((day) => (
              <article className="editor-card" key={day.id}>
                <div className="editor-card-top">
                  <div>
                    <h3>{day.dayLabel}</h3>
                    <p>
                      {day.startPoint || 'Start'} to {day.endPoint || 'End'}
                    </p>
                  </div>
                  <div className="editor-actions">
                    <button
                      type="button"
                      className={`status-toggle ${day.visited ? 'active' : ''}`}
                      onClick={() => toggleVisited(day.id)}
                    >
                      {day.visited ? 'Visited' : 'Mark visited'}
                    </button>
                    <button
                      type="button"
                      className="ghost-button"
                      onClick={() => removeDay(day.id)}
                    >
                      Remove day
                    </button>
                  </div>
                </div>

                <div className="coordinate-grid">
                  <label>
                    <span>Final stop latitude</span>
                    <input
                      type="number"
                      step="any"
                      value={day.overnightLat}
                      onChange={(event) =>
                        updateDayField(day.id, 'overnightLat', event.target.value)
                      }
                    />
                  </label>
                  <label>
                    <span>Final stop longitude</span>
                    <input
                      type="number"
                      step="any"
                      value={day.overnightLng}
                      onChange={(event) =>
                        updateDayField(day.id, 'overnightLng', event.target.value)
                      }
                    />
                  </label>
                </div>

                <div className="minor-stop-list">
                  {day.minorStops.map((stop) => (
                    <div className="minor-stop-card" key={stop.id}>
                      <div className="minor-stop-grid">
                        <input
                          type="text"
                          value={stop.name}
                          placeholder="Stop name"
                          onChange={(event) =>
                            updateMinorStop(day.id, stop.id, 'name', event.target.value)
                          }
                        />
                        <input
                          type="text"
                          value={stop.url}
                          placeholder="Google Maps link"
                          onChange={(event) =>
                            updateMinorStop(day.id, stop.id, 'url', event.target.value)
                          }
                        />
                        <input
                          type="number"
                          step="any"
                          value={stop.lat}
                          placeholder="Latitude"
                          onChange={(event) =>
                            updateMinorStop(day.id, stop.id, 'lat', event.target.value)
                          }
                        />
                        <input
                          type="number"
                          step="any"
                          value={stop.lng}
                          placeholder="Longitude"
                          onChange={(event) =>
                            updateMinorStop(day.id, stop.id, 'lng', event.target.value)
                          }
                        />
                      </div>
                      <textarea
                        value={stop.note}
                        placeholder="Notes for this stop"
                        onChange={(event) =>
                          updateMinorStop(day.id, stop.id, 'note', event.target.value)
                        }
                      />
                      <button
                        type="button"
                        className="ghost-button"
                        onClick={() => removeMinorStop(day.id, stop.id)}
                      >
                        Remove stop
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  className="primary-button"
                  onClick={() => addMinorStop(day.id)}
                >
                  Add smaller stop
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="panel budget-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Budget</p>
              <h2>Expenses and buy list</h2>
            </div>
            <span className="badge">
              {formatCurrency(remainingBudget)} left
            </span>
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

          <div className="dual-section">
            <div>
              <h3 className="subheading">Add expense</h3>
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
                  <option value="Fuel">Fuel</option>
                  <option value="Food">Food</option>
                  <option value="Stay">Stay</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Other">Other</option>
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
                <button type="submit" className="primary-button">
                  Add expense
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
            </div>

            <div>
              <h3 className="subheading">Things to buy</h3>
              <form className="shopping-form" onSubmit={handleShoppingSubmit}>
                <input
                  type="text"
                  name="item"
                  value={shoppingDraft.item}
                  onChange={handleShoppingChange}
                  placeholder="Item to buy"
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
                <button type="submit" className="primary-button">
                  Add item
                </button>
              </form>

              <div className="shopping-list">
                {shoppingList.map((item) => (
                  <article className="expense-card" key={item.id}>
                    <div>
                      <h3>{item.item}</h3>
                      <p>
                        {item.link ? (
                          <a href={item.link} target="_blank" rel="noreferrer">
                            Open saved link
                          </a>
                        ) : (
                          'No link saved'
                        )}
                      </p>
                    </div>
                    <div className="expense-actions">
                      <strong>{formatCurrency(item.price)}</strong>
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
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="panel notes-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Notes</p>
              <h2>Custom notes and reminders</h2>
            </div>
            <span className="badge">Auto-saved</span>
          </div>

          <textarea
            className="notes-box"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Add stay ideas, temple timings, route cautions, fuel notes, food spots, and reminders here..."
          />
        </section>
      </main>
    </div>
  );
}

export default App;
