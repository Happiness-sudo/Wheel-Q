// A Kenyan-style number plate. Used for car registrations and booking references.
export default function Plate({ reg }) {
  return (
    <span className="plate plate--reg" role="img" aria-label={`Registration ${reg}`}>
      <span aria-hidden="true">{reg}</span>
    </span>
  );
}
