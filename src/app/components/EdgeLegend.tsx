export default function EdgeLegend() {
  const legends = [
    { color: "#FAD4E0", label: "Best" },
    { color: "#3d99ca", label: "Better" },
    { color: "#81D8D0", label: "Good" },
    { color: "#000000", label: "Bad" },
  ];

  return (
    <ul className="flex">
      {legends.map((item, index) => (
        <li key={index} className="flex items-center m-1 ">
          <span className="inline-block w-6 h-2 rounded mr-2" style={{ backgroundColor: item.color }}></span>
          <span className="text-sm text-gray-700">{item.label}</span>
        </li>
      ))}
    </ul>
  );
}
