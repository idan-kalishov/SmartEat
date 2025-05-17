import { ReactElement } from "react";

type GoalCubeProps = {
  title: string;
  value: string;
  icon: ReactElement<any, any>;
};

const GoalCube = ({ title, value, icon }: GoalCubeProps) => {
  return (
    <div className="p-6 border-b border-gray-200 bg-white rounded-xl">
      <div className="flex items-center mb-2">
        {icon}
        <span className="text-md text-gray-800">{title}</span>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
};

export default GoalCube;
