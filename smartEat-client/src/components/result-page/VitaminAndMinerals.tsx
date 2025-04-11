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
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

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

const NutrientList = ({
  data,
  nutrients,
}: {
  data: typeof vitaminMeta | typeof mineralMeta;
  nutrients: { [key: string]: number };
}) => (
  <div className="space-y-2">
    {Object.entries(data).map(([key, meta]) => {
      const value = nutrients[key] ?? 0;
      return (
        <div
          key={key}
          className="flex items-center gap-3 px-4 py-2 bg-white rounded-full shadow-md border border-gray-200"
        >
          <div className="shrink-0">{meta.icon}</div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-700">{meta.name}</p>
          </div>
          <div
            className={`text-sm ${
              value === 0 ? "text-gray-400" : "text-gray-500"
            } font-medium`}
          >
            {value === 0 ? "-" : `${value.toFixed(1)}${meta.unit}`}
          </div>
        </div>
      );
    })}
  </div>
);

export default function VitaminAndMinerals({
  nutrients,
}: VitaminAndMineralsProps) {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="vitamins">
        <AccordionTrigger>
          <div className="flex items-center gap-2">
            <MdOpacity size={20} className="text-orange-500" />
            <span className="text-lg font-medium text-gray-800">Vitamins</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <NutrientList data={vitaminMeta} nutrients={nutrients} />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="minerals">
        <AccordionTrigger>
          <div className="flex items-center gap-2">
            <MdBloodtype size={20} className="text-blue-500" />
            <span className="text-lg font-medium text-gray-800">Minerals</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <NutrientList data={mineralMeta} nutrients={nutrients} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
