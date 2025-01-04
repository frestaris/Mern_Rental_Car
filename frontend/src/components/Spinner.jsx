const Spinner = ({ size = 45, color = "#ffbf00" }) => {
  return (
    <div
      className="loader"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        border: `${size / 8}px solid ${color}`,
        borderTop: `${size / 8}px solid transparent`,
      }}
    ></div>
  );
};

export default Spinner;
