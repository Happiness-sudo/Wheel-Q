import { addDays, dayWord, formatDay } from '../lib/dates';

// The big number the visitor sees is the formatted date. The real <input type="date">
// sits invisibly on top of it, so tapping the date opens the browser's own date picker.
function DateField({ id, label, value, min, onChange }) {
  function openPicker(event) {
    try {
      event.currentTarget.showPicker?.();
    } catch {
      // Some browsers only allow this from a direct tap. The normal control still works.
    }
  }

  return (
    <label className="plate-field" htmlFor={id}>
      <span className="plate-field__label">{label}</span>
      <span className="plate-field__value">{formatDay(value)}</span>
      <input
        id={id}
        className="plate-field__input"
        type="date"
        value={value}
        min={min}
        onClick={openPicker}
        onChange={(event) => event.target.value && onChange(event.target.value)}
      />
    </label>
  );
}

export default function SearchPlate({ start, end, days, minDate, onChange }) {
  return (
    <div className="plate plate--search">
      <DateField
        id="pickup-date"
        label="Pick-up date"
        value={start}
        min={minDate}
        onChange={(value) => onChange({ start: value })}
      />
      <span className="plate__sep" aria-hidden="true" />
      <DateField
        id="return-date"
        label="Return date"
        value={end}
        min={addDays(start, 1)}
        onChange={(value) => onChange({ end: value })}
      />
      <span className="plate__sep" aria-hidden="true" />
      <div className="plate-days">
        <span className="plate-days__value">{days}</span>
        <span className="plate-days__label">{dayWord(days)}</span>
      </div>
    </div>
  );
}
