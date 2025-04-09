import { JSX } from "react";
import {
  MdOutlineBolt,
  MdOpacity,
  MdVisibility,
  MdWbSunny,
  MdBubbleChart,
  MdEco,
  MdOutlineLocalHospital,
  MdBloodtype,
} from "react-icons/md";

interface VitaminAndMineralsProps {
  nutrients: {
    [key: string]: number;
  };
}

const vitaminMeta: Record<
  string,
  { name: string; icon: JSX.Element; unit: string }
> = {
  vitaminA: {
    name: "Vitamin A",
    icon: <MdVisibility className="text-orange-400" size={20} />,
    unit: "mcg",
  },
  vitaminC: {
    name: "Vitamin C",
    icon: <MdOpacity className="text-green-500" size={20} />,
    unit: "mg",
  },
  vitaminD: {
    name: "Vitamin D",
    icon: <MdWbSunny className="text-yellow-500" size={20} />,
    unit: "mcg",
  },
  vitaminB12: {
    name: "Vitamin B12",
    icon: <MdBubbleChart className="text-blue-500" size={20} />,
    unit: "mcg",
  },
};

const mineralMeta: Record<
  string,
  { name: string; icon: JSX.Element; unit: string }
> = {
  iron: {
    name: "Iron",
    icon: <MdBloodtype className="text-red-500" size={20} />,
    unit: "mg",
  },
  calcium: {
    name: "Calcium",
    icon: <MdOutlineLocalHospital className="text-purple-500" size={20} />,
    unit: "mg",
  },
  magnesium: {
    name: "Magnesium",
    icon: <MdEco className="text-indigo-500" size={20} />,
    unit: "mg",
  },
};

const NutrientSection = ({
  title,
  data,
  nutrients,
}: {
  title: string;
  data: typeof vitaminMeta;
  nutrients: { [key: string]: number };
}) => (
  <div className="mt-6 px-2">
    <h3 className="text-lg font-semibold mb-3 text-gray-800">{title}</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {Object.entries(data).map(([key, meta]) => {
        const value = nutrients[key];
        if (value == null || value === 0) return null;

        return (
          <div
            key={key}
            className="flex items-center gap-3 px-4 py-2 bg-white rounded-full shadow-md border border-gray-200"
          >
            <div className="shrink-0">{meta.icon}</div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-700">{meta.name}</p>
            </div>
            <div className="text-sm text-gray-500 font-medium">
              {value.toFixed(1)}
              {meta.unit}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

export default function VitaminAndMinerals({
  nutrients,
}: VitaminAndMineralsProps) {
  console.log(nutrients);
  return (
    <>
      <NutrientSection
        title="Vitamins"
        data={vitaminMeta}
        nutrients={nutrients}
      />
      <NutrientSection
        title="Minerals"
        data={mineralMeta}
        nutrients={nutrients}
      />
    </>
  );
}
